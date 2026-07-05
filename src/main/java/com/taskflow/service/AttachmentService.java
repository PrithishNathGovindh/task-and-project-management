package com.taskflow.service;

import com.taskflow.dto.AttachmentResponse;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface AttachmentService {
    AttachmentResponse uploadAttachment(String taskId, MultipartFile file, Authentication authentication);

    List<AttachmentResponse> getAttachments(String taskId, Authentication authentication);

    void deleteAttachment(String attachmentId, Authentication authentication);
}
