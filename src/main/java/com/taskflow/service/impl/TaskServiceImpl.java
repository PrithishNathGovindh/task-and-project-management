package com.taskflow.service.impl;

import com.taskflow.dto.TaskMoveRequest;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskUpdateRequest;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.NotificationType;
import com.taskflow.repository.AttachmentRepository;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.service.TaskService;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectServiceImpl projectService;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final NotificationServiceImpl notificationService;

    public TaskServiceImpl(
        TaskRepository taskRepository,
        ProjectRepository projectRepository,
        ProjectServiceImpl projectService,
        CommentRepository commentRepository,
        AttachmentRepository attachmentRepository,
        NotificationServiceImpl notificationService
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.projectService = projectService;
        this.commentRepository = commentRepository;
        this.attachmentRepository = attachmentRepository;
        this.notificationService = notificationService;
    }

    @Override
    public TaskResponse createTask(TaskRequest request, Authentication authentication) {
        Project project = projectService.getAuthorizedProject(request.getProjectId(), authentication);

        Task task = Task.builder()
            .projectId(project.getId())
            .title(request.getTitle().trim())
            .description(trimToEmpty(request.getDescription()))
            .status(request.getStatus())
            .priority(request.getPriority())
            .deadline(request.getDeadline())
            .assignedTo(resolveAssignedName(request.getAssignedTo(), request.getAssignedUserName()))
            .assignedUserId(trimToEmpty(request.getAssignedUserId()))
            .assignedUserName(resolveAssignedName(request.getAssignedTo(), request.getAssignedUserName()))
            .createdBy(projectService.getAuthenticatedUser(authentication).getId())
            .orderIndex(resolveOrderIndex(request.getOrderIndex(), project.getId(), request.getStatus()))
            .build();

        Task savedTask = taskRepository.save(task);
        notifyAssignment(savedTask);
        return toResponse(savedTask, project);
    }

    @Override
    public List<TaskResponse> getProjectTasks(String projectId, Authentication authentication) {
        Project project = projectService.getAuthorizedProject(projectId, authentication);
        return taskRepository.findByProjectIdOrderByOrderIndexAscCreatedAtDesc(projectId)
            .stream()
            .map(task -> toResponse(task, project))
            .toList();
    }

    @Override
    public TaskResponse getTask(String id, Authentication authentication) {
        Task task = getAuthorizedTask(id, authentication);
        Project project = projectService.getAuthorizedProject(task.getProjectId(), authentication);
        return toResponse(task, project);
    }

    @Override
    public List<TaskResponse> getAllTasks(Authentication authentication) {
        List<Project> projects = getAuthorizedProjects(authentication);
        Map<String, Project> projectMap = projects.stream().collect(Collectors.toMap(Project::getId, Function.identity()));
        return taskRepository.findByProjectIdInOrderByDeadlineAsc(projectMap.keySet())
            .stream()
            .map(task -> toResponse(task, projectMap.get(task.getProjectId())))
            .toList();
    }

    @Override
    public TaskResponse updateTask(String id, TaskUpdateRequest request, Authentication authentication) {
        Task task = getTaskOrThrow(id);
        Project project = projectService.getAuthorizedProject(task.getProjectId(), authentication);

        TaskStatus previousStatus = task.getStatus();
        String previousAssignee = task.getAssignedUserId();
        task.setTitle(request.getTitle().trim());
        task.setDescription(trimToEmpty(request.getDescription()));
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setAssignedTo(resolveAssignedName(request.getAssignedTo(), request.getAssignedUserName()));
        task.setAssignedUserId(trimToEmpty(request.getAssignedUserId()));
        task.setAssignedUserName(resolveAssignedName(request.getAssignedTo(), request.getAssignedUserName()));
        task.setOrderIndex(request.getOrderIndex() == null ? task.getOrderIndex() : request.getOrderIndex());

        Task savedTask = taskRepository.save(task);
        if (!safeEquals(previousAssignee, savedTask.getAssignedUserId())) {
            notifyAssignment(savedTask);
        }
        if (savedTask.getStatus() == TaskStatus.DONE && previousStatus != TaskStatus.DONE) {
            notificationService.createSystemNotification(
                savedTask.getCreatedBy(),
                "Task completed",
                savedTask.getTitle() + " was marked complete.",
                NotificationType.TASK_COMPLETED
            );
        } else {
            notificationService.createSystemNotification(
                savedTask.getCreatedBy(),
                "Task updated",
                savedTask.getTitle() + " was updated.",
                NotificationType.PROJECT
            );
        }
        return toResponse(savedTask, project);
    }

    @Override
    public TaskResponse moveTask(String id, TaskMoveRequest request, Authentication authentication) {
        Task task = getAuthorizedTask(id, authentication);
        Project project = projectService.getAuthorizedProject(task.getProjectId(), authentication);

        TaskStatus previousStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task.setOrderIndex(Math.max(0, request.getOrderIndex()));

        Task savedTask = taskRepository.save(task);
        if (savedTask.getStatus() == TaskStatus.DONE && previousStatus != TaskStatus.DONE) {
            notificationService.createSystemNotification(
                savedTask.getCreatedBy(),
                "Task completed",
                savedTask.getTitle() + " was marked complete.",
                NotificationType.TASK_COMPLETED
            );
        }
        return toResponse(savedTask, project);
    }

    @Override
    public void deleteTask(String id, Authentication authentication) {
        Task task = getTaskOrThrow(id);
        projectService.getAuthorizedProject(task.getProjectId(), authentication);
        commentRepository.deleteByTaskId(task.getId());
        attachmentRepository.deleteByTaskId(task.getId());
        taskRepository.delete(task);
    }

    Task getAuthorizedTask(String id, Authentication authentication) {
        Task task = getTaskOrThrow(id);
        projectService.getAuthorizedProject(task.getProjectId(), authentication);
        return task;
    }

    TaskResponse toResponse(Task task, Project project) {
        return TaskResponse.builder()
            .id(task.getId())
            .projectId(task.getProjectId())
            .projectName(project == null ? "" : project.getName())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .deadline(task.getDeadline())
            .assignedTo(task.getAssignedTo())
            .assignedUserId(task.getAssignedUserId())
            .assignedUserName(task.getAssignedUserName())
            .createdBy(task.getCreatedBy())
            .orderIndex(task.getOrderIndex())
            .commentCount(commentRepository.countByTaskId(task.getId()))
            .attachmentCount(attachmentRepository.countByTaskId(task.getId()))
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }

    List<Project> getAuthorizedProjects(Authentication authentication) {
        String userId = projectService.getAuthenticatedUser(authentication).getId();
        return projectRepository.findByOwnerIdOrMemberIdsContainingOrderByUpdatedAtDesc(userId, userId);
    }

    private Task getTaskOrThrow(String id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private int resolveOrderIndex(Integer requestedOrderIndex, String projectId, TaskStatus status) {
        if (requestedOrderIndex != null) {
            return Math.max(0, requestedOrderIndex);
        }

        return taskRepository.findByProjectIdAndStatusOrderByOrderIndexAscCreatedAtDesc(projectId, status).size();
    }

    private String resolveAssignedName(String assignedTo, String assignedUserName) {
        String value = assignedUserName == null || assignedUserName.isBlank() ? assignedTo : assignedUserName;
        return trimToEmpty(value);
    }

    private String trimToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private void notifyAssignment(Task task) {
        if (task.getAssignedUserId() != null && !task.getAssignedUserId().isBlank()) {
            notificationService.createSystemNotification(
                task.getAssignedUserId(),
                "Task assigned",
                "You were assigned to " + task.getTitle() + ".",
                NotificationType.TASK_ASSIGNED
            );
        }
    }

    private boolean safeEquals(String left, String right) {
        return java.util.Objects.equals(trimToEmpty(left), trimToEmpty(right));
    }
}
