package com.taskflow.service.impl;

import com.taskflow.dto.ProfileResponse;
import com.taskflow.dto.ProfileUpdateRequest;
import com.taskflow.model.ProjectStatus;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AnalyticsService;
import com.taskflow.service.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectServiceImpl projectService;
    private final TaskServiceImpl taskService;
    private final AnalyticsService analyticsService;

    public ProfileServiceImpl(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        ProjectServiceImpl projectService,
        TaskServiceImpl taskService,
        AnalyticsService analyticsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectService = projectService;
        this.taskService = taskService;
        this.analyticsService = analyticsService;
    }

    @Override
    public ProfileResponse getProfile(Authentication authentication) {
        User user = projectService.getAuthenticatedUser(authentication);
        var projects = taskService.getAuthorizedProjects(authentication);
        var projectResponses = projects.stream().map(projectService::toResponse).toList();
        var tasks = taskService.getAllTasks(authentication);
        long completedTasks = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();

        return ProfileResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .profilePicture(user.getProfilePicture())
            .bio(user.getBio())
            .role(user.getRole().name())
            .memberSince(user.getCreatedAt())
            .currentStreak(completedTasks > 0 ? Math.min(7, (int) completedTasks) : 0)
            .notificationsEnabled(user.getNotificationsEnabled())
            .statistics(analyticsService.getAnalytics(authentication))
            .achievements(resolveAchievements(projects.size(), completedTasks))
            .recentProjects(projectResponses.stream().limit(4).toList())
            .completedProjects(projectResponses.stream().filter(project -> project.getStatus() == ProjectStatus.COMPLETED).limit(4).toList())
            .recentlyFinishedTasks(tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).limit(6).toList())
            .build();
    }

    @Override
    public ProfileResponse updateProfile(ProfileUpdateRequest request, Authentication authentication) {
        User user = projectService.getAuthenticatedUser(authentication);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getNotificationsEnabled() != null) {
            user.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        userRepository.save(user);
        return getProfile(authentication);
    }

    private java.util.List<String> resolveAchievements(long projectCount, long completedTasks) {
        java.util.List<String> achievements = new java.util.ArrayList<>();
        if (projectCount > 0) {
            achievements.add("First Workspace");
        }
        if (completedTasks >= 100) {
            achievements.add("100 Tasks Completed");
        }
        if (completedTasks >= 7) {
            achievements.add("7 Day Streak");
        }
        if (projectCount >= 5) {
            achievements.add("Project Master");
        }
        return achievements;
    }
}
