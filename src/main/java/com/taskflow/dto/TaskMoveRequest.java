package com.taskflow.dto;

import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskMoveRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Order index is required")
    private Integer orderIndex;
}
