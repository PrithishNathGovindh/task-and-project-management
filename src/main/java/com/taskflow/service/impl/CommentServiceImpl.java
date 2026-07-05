package com.taskflow.service.impl;

import com.taskflow.dto.CommentRequest;
import com.taskflow.dto.CommentResponse;
import com.taskflow.exception.ForbiddenResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Comment;
import com.taskflow.model.NotificationType;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.CommentRepository;
import com.taskflow.service.CommentService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskServiceImpl taskService;
    private final ProjectServiceImpl projectService;
    private final NotificationServiceImpl notificationService;

    public CommentServiceImpl(
        CommentRepository commentRepository,
        TaskServiceImpl taskService,
        ProjectServiceImpl projectService,
        NotificationServiceImpl notificationService
    ) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.projectService = projectService;
        this.notificationService = notificationService;
    }

    @Override
    public CommentResponse createComment(String taskId, CommentRequest request, Authentication authentication) {
        Task task = taskService.getAuthorizedTask(taskId, authentication);
        User user = projectService.getAuthenticatedUser(authentication);

        Comment comment = Comment.builder()
            .taskId(task.getId())
            .userId(user.getId())
            .userName(user.getFullName())
            .message(request.getMessage().trim())
            .build();

        Comment savedComment = commentRepository.save(comment);
        if (task.getCreatedBy() != null && !task.getCreatedBy().equals(user.getId())) {
            notificationService.createSystemNotification(
                task.getCreatedBy(),
                "New comment",
                user.getFullName() + " commented on " + task.getTitle() + ".",
                NotificationType.COMMENT
            );
        }
        return toResponse(savedComment, user.getId());
    }

    @Override
    public List<CommentResponse> getComments(String taskId, Authentication authentication) {
        taskService.getAuthorizedTask(taskId, authentication);
        String userId = projectService.getAuthenticatedUser(authentication).getId();
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
            .stream()
            .map(comment -> toResponse(comment, userId))
            .toList();
    }

    @Override
    public void deleteComment(String commentId, Authentication authentication) {
        User user = projectService.getAuthenticatedUser(authentication);
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        taskService.getAuthorizedTask(comment.getTaskId(), authentication);

        if (!user.getId().equals(comment.getUserId())) {
            throw new ForbiddenResourceException("You can delete only your own comments");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment, String currentUserId) {
        return CommentResponse.builder()
            .id(comment.getId())
            .taskId(comment.getTaskId())
            .userId(comment.getUserId())
            .userName(comment.getUserName())
            .message(comment.getMessage())
            .createdAt(comment.getCreatedAt())
            .ownComment(currentUserId.equals(comment.getUserId()))
            .build();
    }
}
