package com.taskflow.dto;

import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class TaskUpdateRequest {

    @NotBlank(message = "Task name is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    private LocalDate deadline;
    private String assignedTo;
    private String assignedUserId;
    private String assignedUserName;
    private Integer orderIndex;
}
