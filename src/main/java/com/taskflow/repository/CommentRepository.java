package com.taskflow.repository;

import com.taskflow.model.Comment;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTaskIdOrderByCreatedAtDesc(String taskId);

    long countByTaskId(String taskId);

    void deleteByTaskId(String taskId);
}
