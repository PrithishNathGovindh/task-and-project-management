package com.taskflow.service.impl;

import com.taskflow.dto.SearchResponse;
import com.taskflow.dto.SearchResultItemResponse;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.SearchService;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskServiceImpl taskService;

    public SearchServiceImpl(TaskRepository taskRepository, UserRepository userRepository, TaskServiceImpl taskService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskService = taskService;
    }

    @Override
    public SearchResponse search(String query, Authentication authentication) {
        String normalized = query == null ? "" : query.trim().toLowerCase();
        if (normalized.isBlank()) {
            return SearchResponse.builder().projects(List.of()).tasks(List.of()).members(List.of()).build();
        }

        List<Project> projects = taskService.getAuthorizedProjects(authentication);
        List<String> projectIds = projects.stream().map(Project::getId).toList();
        Map<String, Project> projectMap = projects.stream().collect(Collectors.toMap(Project::getId, Function.identity()));
        List<Task> tasks = projectIds.isEmpty() ? List.of() : taskRepository.findByProjectIdInOrderByDeadlineAsc(projectIds);

        return SearchResponse.builder()
            .projects(projects.stream()
                .filter(project -> contains(project.getName(), normalized) || contains(project.getDescription(), normalized))
                .limit(12)
                .map(project -> item(project.getId(), project.getName(), project.getDescription(), "PROJECT", "/projects/" + project.getId()))
                .toList())
            .tasks(tasks.stream()
                .filter(task -> contains(task.getTitle(), normalized) || contains(task.getDescription(), normalized))
                .limit(12)
                .map(task -> item(task.getId(), task.getTitle(), projectMap.get(task.getProjectId()).getName(), "TASK", "/projects/" + task.getProjectId()))
                .toList())
            .members(userRepository.findTop8ByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(normalized, normalized)
                .stream()
                .filter(user -> projects.stream().anyMatch(project -> project.getMemberIds() != null && project.getMemberIds().contains(user.getId())))
                .map(user -> item(user.getId(), user.getFullName(), user.getEmail(), "MEMBER", "/profile"))
                .toList())
            .build();
    }

    private SearchResultItemResponse item(String id, String title, String subtitle, String type, String url) {
        return SearchResultItemResponse.builder().id(id).title(title).subtitle(subtitle).type(type).url(url).build();
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
