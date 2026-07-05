package com.taskflow.service.impl;

import com.taskflow.dto.DashboardResponse;
import com.taskflow.model.Project;
import com.taskflow.model.TaskStatus;
import com.taskflow.repository.TaskRepository;
import com.taskflow.service.DashboardService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final ProjectServiceImpl projectService;
    private final TaskServiceImpl taskService;

    public DashboardServiceImpl(TaskRepository taskRepository, ProjectServiceImpl projectService, TaskServiceImpl taskService) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.taskService = taskService;
    }

    @Override
    public DashboardResponse getDashboard(Authentication authentication) {
        List<Project> projects = taskService.getAuthorizedProjects(authentication);
        List<String> projectIds = projects.stream().map(Project::getId).toList();
        Map<String, Project> projectMap = projects.stream().collect(Collectors.toMap(Project::getId, Function.identity()));

        if (projectIds.isEmpty()) {
            return DashboardResponse.builder()
                .todaysTasks(List.of())
                .recentProjects(List.of())
                .upcomingDeadlines(List.of())
                .taskCount(0)
                .projectCount(0)
                .completedTasks(0)
                .pendingTasks(0)
                .build();
        }

        LocalDate today = LocalDate.now();

        return DashboardResponse.builder()
            .todaysTasks(taskRepository.findByProjectIdInAndDeadline(projectIds, today)
                .stream()
                .map(task -> taskService.toResponse(task, projectMap.get(task.getProjectId())))
                .toList())
            .recentProjects(projects.stream().limit(4).map(projectService::toResponse).toList())
            .upcomingDeadlines(taskRepository.findTop6ByProjectIdInAndDeadlineGreaterThanEqualOrderByDeadlineAsc(projectIds, today)
                .stream()
                .map(task -> taskService.toResponse(task, projectMap.get(task.getProjectId())))
                .toList())
            .taskCount(taskRepository.countByProjectIdIn(projectIds))
            .projectCount(projects.size())
            .completedTasks(taskRepository.countByProjectIdInAndStatus(projectIds, TaskStatus.DONE))
            .pendingTasks(taskRepository.countByProjectIdInAndStatusNot(projectIds, TaskStatus.DONE))
            .build();
    }
}
