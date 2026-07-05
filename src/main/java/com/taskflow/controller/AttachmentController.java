package com.taskflow.controller;

import com.taskflow.dto.AttachmentResponse;
import com.taskflow.service.AttachmentService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(value = "/tasks/{taskId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(
        @PathVariable String taskId,
        @RequestParam("file") MultipartFile file,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attachmentService.uploadAttachment(taskId, file, authentication));
    }

    @GetMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(@PathVariable String taskId, Authentication authentication) {
        return ResponseEntity.ok(attachmentService.getAttachments(taskId, authentication));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable String attachmentId, Authentication authentication) {
        attachmentService.deleteAttachment(attachmentId, authentication);
        return ResponseEntity.noContent().build();
    }
}
