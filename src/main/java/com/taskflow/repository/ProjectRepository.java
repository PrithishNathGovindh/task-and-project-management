package com.taskflow.repository;

import com.taskflow.model.Project;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByOwnerIdOrMemberIdsContainingOrderByUpdatedAtDesc(String ownerId, String memberId);

    long countByOwnerId(String ownerId);

    long countByOwnerIdAndStatus(String ownerId, com.taskflow.model.ProjectStatus status);
}
