package com.taskflow.service;

import com.taskflow.dto.CommentRequest;
import com.taskflow.dto.CommentResponse;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface CommentService {
    CommentResponse createComment(String taskId, CommentRequest request, Authentication authentication);

    List<CommentResponse> getComments(String taskId, Authentication authentication);

    void deleteComment(String commentId, Authentication authentication);
}
