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
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String projectId;
    private String title;
    private String description;

    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    private LocalDate deadline;
    private String assignedTo;
    private String assignedUserId;
    private String assignedUserName;
    private String createdBy;

    @Builder.Default
    private Integer orderIndex = 0;

    @Builder.Default
    private List<String> comments = new ArrayList<>();

    @Builder.Default
    private List<String> attachments = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
