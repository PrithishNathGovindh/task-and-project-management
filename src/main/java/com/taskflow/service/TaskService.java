package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskUpdateRequest;
import com.taskflow.dto.TaskMoveRequest;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, Authentication authentication);

    List<TaskResponse> getProjectTasks(String projectId, Authentication authentication);

    List<TaskResponse> getAllTasks(Authentication authentication);

    TaskResponse getTask(String id, Authentication authentication);

    TaskResponse updateTask(String id, TaskUpdateRequest request, Authentication authentication);

    TaskResponse moveTask(String id, TaskMoveRequest request, Authentication authentication);

    void deleteTask(String id, Authentication authentication);
}
