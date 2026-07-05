package com.taskflow.service.impl;

import com.taskflow.dto.NotificationRequest;
import com.taskflow.dto.NotificationResponse;
import com.taskflow.exception.ForbiddenResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Notification;
import com.taskflow.model.NotificationType;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.NotificationRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.NotificationService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public NotificationServiceImpl(
        NotificationRepository notificationRepository,
        UserRepository userRepository,
        ProjectRepository projectRepository,
        TaskRepository taskRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public NotificationResponse createNotification(NotificationRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (!user.getId().equals(request.getUserId())) {
            throw new ForbiddenResourceException("You can create only your own notifications");
        }

        return toResponse(saveNotification(request.getUserId(), request.getTitle(), request.getMessage(), request.getType()));
    }

    @Override
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        createDeadlineNotifications(authentication);
        String userId = getAuthenticatedUser(authentication).getId();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    @Override
    public NotificationResponse markAsRead(String id, Authentication authentication) {
        Notification notification = getOwnedNotification(id, authentication);
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponse> markAllAsRead(Authentication authentication) {
        String userId = getAuthenticatedUser(authentication).getId();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);
        return getNotifications(authentication);
    }

    @Override
    public void deleteNotification(String id, Authentication authentication) {
        notificationRepository.delete(getOwnedNotification(id, authentication));
    }

    @Override
    public void createSystemNotification(String userId, String title, String message, NotificationType type) {
        userRepository.findById(userId)
            .filter(user -> user.getNotificationsEnabled() == null || user.getNotificationsEnabled())
            .ifPresent(user -> saveNotification(user.getId(), title, message, type));
    }

    @Override
    public void createDeadlineNotifications(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Project> projects = projectRepository.findByOwnerIdOrMemberIdsContainingOrderByUpdatedAtDesc(user.getId(), user.getId());
        List<String> projectIds = projects.stream().map(Project::getId).toList();
        if (projectIds.isEmpty()) {
            return;
        }

        String userId = user.getId();
        List<Task> dueSoon = taskRepository.findByProjectIdInAndDeadlineBetweenAndStatusNot(
            projectIds,
            LocalDate.now(),
            LocalDate.now().plusDays(1),
            TaskStatus.DONE
        );

        dueSoon.stream()
            .filter(task -> task.getAssignedUserId() == null || task.getAssignedUserId().isBlank() || userId.equals(task.getAssignedUserId()))
            .forEach(task -> createSystemNotification(
                userId,
                "Deadline approaching",
                task.getTitle() + " is due within 24 hours.",
                NotificationType.DEADLINE
            ));
    }

    private Notification getOwnedNotification(String id, Authentication authentication) {
        String userId = getAuthenticatedUser(authentication).getId();
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!userId.equals(notification.getUserId())) {
            throw new ForbiddenResourceException("You do not have access to this notification");
        }
        return notification;
    }

    private Notification saveNotification(String userId, String title, String message, NotificationType type) {
        String normalizedTitle = title.trim();
        String normalizedMessage = message.trim();
        if (notificationRepository.existsByUserIdAndTitleAndMessageAndIsReadFalse(userId, normalizedTitle, normalizedMessage)) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(notification -> normalizedTitle.equals(notification.getTitle()) && normalizedMessage.equals(notification.getMessage()) && !Boolean.TRUE.equals(notification.getIsRead()))
                .findFirst()
                .orElseGet(() -> Notification.builder().userId(userId).title(normalizedTitle).message(normalizedMessage).type(type).isRead(false).build());
        }

        return notificationRepository.save(Notification.builder()
            .userId(userId)
            .title(normalizedTitle)
            .message(normalizedMessage)
            .type(type)
            .isRead(false)
            .build());
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ForbiddenResourceException("Authentication is required");
        }
        return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
            .id(notification.getId())
            .userId(notification.getUserId())
            .title(notification.getTitle())
            .message(notification.getMessage())
            .type(notification.getType())
            .isRead(Boolean.TRUE.equals(notification.getIsRead()))
            .createdAt(notification.getCreatedAt())
            .build();
    }
}
