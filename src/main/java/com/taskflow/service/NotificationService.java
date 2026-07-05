package com.taskflow.service;

import com.taskflow.dto.NotificationRequest;
import com.taskflow.dto.NotificationResponse;
import com.taskflow.model.NotificationType;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface NotificationService {
    NotificationResponse createNotification(NotificationRequest request, Authentication authentication);

    List<NotificationResponse> getNotifications(Authentication authentication);

    NotificationResponse markAsRead(String id, Authentication authentication);

    List<NotificationResponse> markAllAsRead(Authentication authentication);

    void deleteNotification(String id, Authentication authentication);

    void createSystemNotification(String userId, String title, String message, NotificationType type);

    void createDeadlineNotifications(Authentication authentication);
}
