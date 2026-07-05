package com.taskflow.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    private String name;
    private String description;
    private ProjectType type;
    private ProjectCategory category;
    private String color;

    @Builder.Default
    private Integer progress = 0;

    private String ownerId;

    @Builder.Default
    private List<String> memberIds = new ArrayList<>();

    private LocalDate deadline;

    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
