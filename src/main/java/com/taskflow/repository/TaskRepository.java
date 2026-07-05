package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectIdOrderByOrderIndexAscCreatedAtDesc(String projectId);

    List<Task> findByProjectIdAndStatusOrderByOrderIndexAscCreatedAtDesc(String projectId, TaskStatus status);

    List<Task> findByProjectIdInOrderByDeadlineAsc(Collection<String> projectIds);

    long countByProjectIdIn(Collection<String> projectIds);

    long countByProjectIdInAndStatus(Collection<String> projectIds, TaskStatus status);

    long countByProjectIdInAndStatusNot(Collection<String> projectIds, TaskStatus status);

    List<Task> findTop6ByProjectIdInAndDeadlineGreaterThanEqualOrderByDeadlineAsc(Collection<String> projectIds, LocalDate date);

    List<Task> findByProjectIdInAndDeadline(Collection<String> projectIds, LocalDate deadline);

    List<Task> findByProjectIdInAndDeadlineBetweenAndStatusNot(Collection<String> projectIds, LocalDate start, LocalDate end, TaskStatus status);

    void deleteByProjectId(String projectId);
}
