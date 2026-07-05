package com.taskflow.dto;

import com.taskflow.model.TaskPriority;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiGeneratedTaskResponse {
    private String title;
    private String description;
    private TaskPriority priority;
}
