package com.taskflow.service.impl;

import com.taskflow.dto.AttachmentResponse;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Attachment;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.AttachmentRepository;
import com.taskflow.service.AttachmentService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskServiceImpl taskService;
    private final ProjectServiceImpl projectService;
    private final Path uploadRoot = Path.of("uploads", "attachments");

    public AttachmentServiceImpl(AttachmentRepository attachmentRepository, TaskServiceImpl taskService, ProjectServiceImpl projectService) {
        this.attachmentRepository = attachmentRepository;
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @Override
    public AttachmentResponse uploadAttachment(String taskId, MultipartFile file, Authentication authentication) {
        Task task = taskService.getAuthorizedTask(taskId, authentication);
        User user = projectService.getAuthenticatedUser(authentication);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Attachment file is required");
        }

        String originalName = Path.of(file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename()).getFileName().toString();
        String storedName = UUID.randomUUID() + "-" + originalName;

        try {
            Files.createDirectories(uploadRoot);
            Files.copy(file.getInputStream(), uploadRoot.resolve(storedName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new BadRequestException("Could not upload attachment");
        }

        Attachment attachment = Attachment.builder()
            .taskId(task.getId())
            .fileName(originalName)
            .fileType(file.getContentType())
            .fileUrl("/uploads/attachments/" + storedName)
            .uploadedBy(user.getFullName())
            .build();

        return toResponse(attachmentRepository.save(attachment));
    }

    @Override
    public List<AttachmentResponse> getAttachments(String taskId, Authentication authentication) {
        taskService.getAuthorizedTask(taskId, authentication);
        return attachmentRepository.findByTaskIdOrderByUploadedAtDesc(taskId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    public void deleteAttachment(String attachmentId, Authentication authentication) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
        taskService.getAuthorizedTask(attachment.getTaskId(), authentication);
        attachmentRepository.delete(attachment);
    }

    private AttachmentResponse toResponse(Attachment attachment) {
        return AttachmentResponse.builder()
            .id(attachment.getId())
            .taskId(attachment.getTaskId())
            .fileName(attachment.getFileName())
            .fileType(attachment.getFileType())
            .fileUrl(attachment.getFileUrl())
            .uploadedBy(attachment.getUploadedBy())
            .uploadedAt(attachment.getUploadedAt())
            .build();
    }
}
