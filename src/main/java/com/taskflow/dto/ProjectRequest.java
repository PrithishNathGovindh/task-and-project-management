package com.taskflow.dto;

import com.taskflow.model.ProjectCategory;
import com.taskflow.model.ProjectStatus;
import com.taskflow.model.ProjectType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class ProjectRequest {

    private String name;

    private String workspaceName;

    @jakarta.validation.constraints.NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Project type is required")
    private ProjectType type;

    @NotNull(message = "Project category is required")
    private ProjectCategory category;

    private String color;
    private Integer progress;
    private List<String> memberIds;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    private ProjectStatus status;
}
