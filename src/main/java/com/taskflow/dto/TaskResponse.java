package com.taskflow.dto;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {
    private String id;
    private String projectId;
    private String projectName;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate deadline;
    private String assignedTo;
    private String assignedUserId;
    private String assignedUserName;
    private String createdBy;
    private Integer orderIndex;
    private Long commentCount;
    private Long attachmentCount;
    private Instant createdAt;
    private Instant updatedAt;
}
