package com.taskflow.controller;

import com.taskflow.dto.NotificationRequest;
import com.taskflow.dto.NotificationResponse;
import com.taskflow.service.NotificationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
        @Valid @RequestBody NotificationRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request, authentication));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotifications(authentication));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(notificationService.markAsRead(id, authentication));
    }

    @PutMapping("/read-all")
    public ResponseEntity<List<NotificationResponse>> markAllAsRead(Authentication authentication) {
        return ResponseEntity.ok(notificationService.markAllAsRead(authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id, Authentication authentication) {
        notificationService.deleteNotification(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
