package com.taskflow.service.impl;

import com.taskflow.dto.InviteMemberRequest;
import com.taskflow.dto.ProjectMemberResponse;
import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ForbiddenResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UserNotFoundException;
import com.taskflow.model.Project;
import com.taskflow.model.ProjectStatus;
import com.taskflow.model.ProjectType;
import com.taskflow.model.NotificationType;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.ProjectService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationServiceImpl notificationService;

    public ProjectServiceImpl(
        ProjectRepository projectRepository,
        TaskRepository taskRepository,
        UserRepository userRepository,
        NotificationServiceImpl notificationService
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public ProjectResponse createProject(ProjectRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<String> memberIds = normalizeMemberIds(request.getType(), request.getMemberIds(), user.getId());

        Project project = Project.builder()
            .name(resolveWorkspaceName(request))
            .description(request.getDescription().trim())
            .type(request.getType())
            .category(request.getCategory())
            .color(resolveColor(request.getColor()))
            .progress(resolveProgress(request.getProgress()))
            .ownerId(user.getId())
            .memberIds(memberIds)
            .deadline(request.getDeadline())
            .status(request.getStatus() == null ? ProjectStatus.ACTIVE : request.getStatus())
            .build();

        return toResponse(projectRepository.save(project));
    }

    @Override
    public List<ProjectResponse> getProjects(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return projectRepository.findByOwnerIdOrMemberIdsContainingOrderByUpdatedAtDesc(user.getId(), user.getId())
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    public ProjectResponse getProject(String id, Authentication authentication) {
        return toResponse(getAuthorizedProject(id, authentication));
    }

    @Override
    public ProjectResponse updateProject(String id, ProjectRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Project project = getProjectOrThrow(id);
        assertProjectOwner(project, user.getId());

        project.setName(resolveWorkspaceName(request));
        project.setDescription(request.getDescription().trim());
        project.setType(request.getType());
        project.setCategory(request.getCategory());
        project.setColor(resolveColor(request.getColor()));
        project.setProgress(resolveProgress(request.getProgress()));
        project.setMemberIds(normalizeMemberIds(request.getType(), request.getMemberIds(), user.getId()));
        project.setDeadline(request.getDeadline());
        project.setStatus(request.getStatus() == null ? ProjectStatus.ACTIVE : request.getStatus());

        return toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(String id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Project project = getProjectOrThrow(id);
        assertProjectOwner(project, user.getId());
        taskRepository.deleteByProjectId(project.getId());
        projectRepository.delete(project);
    }

    @Override
    public ProjectResponse inviteMember(String projectId, InviteMemberRequest request, Authentication authentication) {
        User owner = getAuthenticatedUser(authentication);
        Project project = getProjectOrThrow(projectId);
        assertProjectOwner(project, owner.getId());

        if (project.getType() != ProjectType.TEAM) {
            throw new BadRequestException("Solo workspace cannot invite members");
        }

        String email = request.getEmail().trim().toLowerCase();
        User member = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found."));

        List<String> memberIds = project.getMemberIds() == null ? new ArrayList<>() : new ArrayList<>(project.getMemberIds());
        if (memberIds.contains(member.getId())) {
            throw new BadRequestException("User already added.");
        }

        memberIds.add(member.getId());
        project.setMemberIds(memberIds);
        Project savedProject = projectRepository.save(project);
        notificationService.createSystemNotification(
            member.getId(),
            "Workspace invite",
            owner.getFullName() + " added you to " + savedProject.getName() + ".",
            NotificationType.PROJECT
        );
        return toResponse(savedProject);
    }

    Project getAuthorizedProject(String id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Project project = getProjectOrThrow(id);
        assertProjectAccess(project, user.getId());
        return project;
    }

    ProjectResponse toResponse(Project project) {
        long taskCount = taskRepository.countByProjectIdIn(List.of(project.getId()));
        long completedTaskCount = taskRepository.countByProjectIdInAndStatus(List.of(project.getId()), TaskStatus.DONE);
        int progress = taskCount == 0 ? project.getProgress() : (int) Math.round((completedTaskCount * 100.0) / taskCount);

        if (project.getProgress() == null || project.getProgress() != progress) {
            project.setProgress(progress);
            projectRepository.save(project);
        }

        return ProjectResponse.builder()
            .id(project.getId())
            .name(project.getName())
            .workspaceName(project.getName())
            .description(project.getDescription())
            .type(project.getType())
            .category(project.getCategory())
            .color(project.getColor())
            .progress(progress)
            .ownerId(project.getOwnerId())
            .ownerName(resolveOwnerName(project.getOwnerId()))
            .memberIds(project.getMemberIds())
            .members(resolveMembers(project))
            .membersCount(project.getMemberIds() == null ? 1 : project.getMemberIds().size())
            .deadline(project.getDeadline())
            .status(project.getStatus())
            .taskCount(taskCount)
            .completedTaskCount(completedTaskCount)
            .createdAt(project.getCreatedAt())
            .updatedAt(project.getUpdatedAt())
            .build();
    }

    User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ForbiddenResourceException("Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private Project getProjectOrThrow(String id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private void assertProjectAccess(Project project, String userId) {
        boolean isOwner = userId.equals(project.getOwnerId());
        boolean isMember = project.getMemberIds() != null && project.getMemberIds().contains(userId);

        if (!isOwner && !isMember) {
            throw new ForbiddenResourceException("You do not have access to this project");
        }
    }

    private void assertProjectOwner(Project project, String userId) {
        if (!userId.equals(project.getOwnerId())) {
            throw new ForbiddenResourceException("Only the workspace owner can perform this action");
        }
    }

    private List<String> normalizeMemberIds(ProjectType type, List<String> memberIds, String ownerId) {
        List<String> normalized = new ArrayList<>();
        normalized.add(ownerId);

        if (type == ProjectType.TEAM && memberIds != null) {
            memberIds.stream()
                .filter(memberId -> memberId != null && !memberId.isBlank())
                .map(String::trim)
                .filter(memberId -> !normalized.contains(memberId))
                .forEach(normalized::add);
        }

        return normalized;
    }

    private String resolveWorkspaceName(ProjectRequest request) {
        String workspaceName = request.getWorkspaceName();
        if (workspaceName == null || workspaceName.isBlank()) {
            workspaceName = request.getName();
        }

        if (workspaceName == null || workspaceName.isBlank()) {
            throw new BadRequestException("Workspace name is required");
        }

        return workspaceName.trim();
    }

    private String resolveOwnerName(String ownerId) {
        return userRepository.findById(ownerId)
            .map(User::getFullName)
            .orElse("Unknown owner");
    }

    private List<ProjectMemberResponse> resolveMembers(Project project) {
        List<String> memberIds = project.getMemberIds();
        if (memberIds == null || memberIds.isEmpty()) {
            memberIds = List.of(project.getOwnerId());
        }

        return userRepository.findAllById(memberIds)
            .stream()
            .map(user -> ProjectMemberResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .owner(user.getId().equals(project.getOwnerId()))
                .build())
            .toList();
    }

    private String resolveColor(String color) {
        return color == null || color.isBlank() ? "#14b8a6" : color.trim();
    }

    private int resolveProgress(Integer progress) {
        if (progress == null) {
            return 0;
        }

        return Math.max(0, Math.min(100, progress));
    }

}
