package com.taskflow.controller;

import com.taskflow.dto.CommentRequest;
import com.taskflow.dto.CommentResponse;
import com.taskflow.service.CommentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<CommentResponse> createComment(
        @PathVariable String taskId,
        @Valid @RequestBody CommentRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.createComment(taskId, request, authentication));
    }

    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String taskId, Authentication authentication) {
        return ResponseEntity.ok(commentService.getComments(taskId, authentication));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId, Authentication authentication) {
        commentService.deleteComment(commentId, authentication);
        return ResponseEntity.noContent().build();
    }
}
