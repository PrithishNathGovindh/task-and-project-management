package com.taskflow.repository;

import com.taskflow.model.Notification;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    long countByUserIdAndIsReadFalse(String userId);

    List<Notification> findByUserIdAndIsReadFalse(String userId);

    boolean existsByUserIdAndTitleAndMessageAndIsReadFalse(String userId, String title, String message);
}
