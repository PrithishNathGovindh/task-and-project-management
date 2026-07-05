package com.taskflow.controller;

import com.taskflow.dto.InviteMemberRequest;
import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.service.ProjectService;
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
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, authentication));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(Authentication authentication) {
        return ResponseEntity.ok(projectService.getProjects(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(projectService.getProject(id, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
        @PathVariable String id,
        @Valid @RequestBody ProjectRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id, Authentication authentication) {
        projectService.deleteProject(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<ProjectResponse> inviteMember(
        @PathVariable String projectId,
        @Valid @RequestBody InviteMemberRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(projectService.inviteMember(projectId, request, authentication));
    }
}
