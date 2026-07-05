package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiTaskGenerationRequest {
    @NotBlank(message = "Project idea is required")
    private String idea;
}
