package com.taskflow.dto;

import com.taskflow.model.ProjectCategory;
import com.taskflow.model.ProjectStatus;
import com.taskflow.model.ProjectType;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectResponse {
    private String id;
    private String name;
    private String workspaceName;
    private String description;
    private ProjectType type;
    private ProjectCategory category;
    private String color;
    private Integer progress;
    private String ownerId;
    private String ownerName;
    private List<String> memberIds;
    private List<ProjectMemberResponse> members;
    private Integer membersCount;
    private LocalDate deadline;
    private ProjectStatus status;
    private Long taskCount;
    private Long completedTaskCount;
    private Instant createdAt;
    private Instant updatedAt;
}
