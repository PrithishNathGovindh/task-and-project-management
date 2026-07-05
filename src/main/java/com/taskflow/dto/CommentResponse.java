package com.taskflow.dto;

import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentResponse {
    private String id;
    private String taskId;
    private String userId;
    private String userName;
    private String message;
    private Instant createdAt;
    private Boolean ownComment;
}
