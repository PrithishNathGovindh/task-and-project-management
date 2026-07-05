package com.taskflow.service;

import com.taskflow.dto.InviteMemberRequest;
import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request, Authentication authentication);

    List<ProjectResponse> getProjects(Authentication authentication);

    ProjectResponse getProject(String id, Authentication authentication);

    ProjectResponse updateProject(String id, ProjectRequest request, Authentication authentication);

    void deleteProject(String id, Authentication authentication);

    ProjectResponse inviteMember(String projectId, InviteMemberRequest request, Authentication authentication);
}
