package com.taskflow.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attachments")
public class Attachment {

    @Id
    private String id;

    private String taskId;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private String uploadedBy;

    @CreatedDate
    private Instant uploadedAt;
}
