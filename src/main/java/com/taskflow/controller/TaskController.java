package com.taskflow.controller;

import com.taskflow.dto.TaskMoveRequest;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.dto.TaskUpdateRequest;
import com.taskflow.service.TaskService;
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
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request, authentication));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getAllTasks(authentication));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(@PathVariable String projectId, Authentication authentication) {
        return ResponseEntity.ok(taskService.getProjectTasks(projectId, authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(taskService.getTask(id, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
        @PathVariable String id,
        @Valid @RequestBody TaskUpdateRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, authentication));
    }

    @PutMapping("/{id}/move")
    public ResponseEntity<TaskResponse> moveTask(
        @PathVariable String id,
        @Valid @RequestBody TaskMoveRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.moveTask(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id, Authentication authentication) {
        taskService.deleteTask(id, authentication);
        return ResponseEntity.noContent().build();
    }
}
