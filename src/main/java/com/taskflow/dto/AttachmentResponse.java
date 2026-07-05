package com.taskflow.dto;

import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttachmentResponse {
    private String id;
    private String taskId;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private String uploadedBy;
    private Instant uploadedAt;
}
