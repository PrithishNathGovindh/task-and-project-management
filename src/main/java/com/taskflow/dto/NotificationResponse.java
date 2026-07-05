package com.taskflow.dto;

import com.taskflow.model.NotificationType;
import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private String userId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private Instant createdAt;
}
