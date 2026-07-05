package com.taskflow.repository;

import com.taskflow.model.Attachment;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    List<Attachment> findByTaskIdOrderByUploadedAtDesc(String taskId);

    long countByTaskId(String taskId);

    void deleteByTaskId(String taskId);
}
