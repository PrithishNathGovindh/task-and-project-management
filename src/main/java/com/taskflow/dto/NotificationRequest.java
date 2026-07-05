package com.taskflow.dto;

import com.taskflow.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotBlank(message = "User id is required")
    private String userId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Type is required")
    private NotificationType type;
}
