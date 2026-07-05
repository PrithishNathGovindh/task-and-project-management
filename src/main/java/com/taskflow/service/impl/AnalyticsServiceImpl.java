package com.taskflow.service.impl;

import com.taskflow.dto.AnalyticsResponse;
import com.taskflow.dto.ChartPointResponse;
import com.taskflow.model.Project;
import com.taskflow.model.ProjectStatus;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.service.AnalyticsService;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TaskServiceImpl taskService;
    private final ProjectServiceImpl projectService;

    public AnalyticsServiceImpl(
        ProjectRepository projectRepository,
        TaskRepository taskRepository,
        TaskServiceImpl taskService,
        ProjectServiceImpl projectService
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @Override
    public AnalyticsResponse getAnalytics(Authentication authentication) {
        String userId = projectService.getAuthenticatedUser(authentication).getId();
        List<Project> projects = taskService.getAuthorizedProjects(authentication);
        List<String> projectIds = projects.stream().map(Project::getId).toList();

        long totalProjects = projects.size();
        long completedProjects = projectRepository.countByOwnerIdAndStatus(userId, ProjectStatus.COMPLETED);
        long pendingProjects = Math.max(0, totalProjects - completedProjects);

        if (projectIds.isEmpty()) {
            return emptyAnalytics();
        }

        List<Task> tasks = taskRepository.findByProjectIdInOrderByDeadlineAsc(projectIds);
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long pendingTasks = totalTasks - completedTasks;
        long overdueTasks = tasks.stream()
            .filter(task -> task.getDeadline() != null && task.getDeadline().isBefore(LocalDate.now()) && task.getStatus() != TaskStatus.DONE)
            .count();
        int completionPercentage = totalTasks == 0 ? 0 : (int) Math.round(completedTasks * 100.0 / totalTasks);

        return AnalyticsResponse.builder()
            .totalProjects(totalProjects)
            .completedProjects(completedProjects)
            .pendingProjects(pendingProjects)
            .totalTasks(totalTasks)
            .completedTasks(completedTasks)
            .pendingTasks(pendingTasks)
            .overdueTasks(overdueTasks)
            .completionPercentage(completionPercentage)
            .productivityScore(Math.min(100, completionPercentage + Math.max(0, 20 - (int) overdueTasks * 2)))
            .weeklyProductivity(weeklyProductivity(tasks))
            .taskStatusDistribution(taskStatusDistribution(tasks))
            .monthlyActivity(monthlyActivity(tasks))
            .projectCompletionTrend(projectCompletionTrend(projects))
            .build();
    }

    private AnalyticsResponse emptyAnalytics() {
        return AnalyticsResponse.builder()
            .weeklyProductivity(List.of())
            .taskStatusDistribution(List.of())
            .monthlyActivity(List.of())
            .projectCompletionTrend(List.of())
            .build();
    }

    private List<ChartPointResponse> weeklyProductivity(List<Task> tasks) {
        LocalDate today = LocalDate.now();
        return java.util.stream.IntStream.rangeClosed(0, 6)
            .mapToObj(offset -> today.minusDays(6L - offset))
            .map(day -> ChartPointResponse.builder()
                .label(day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                .value(tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE && sameDay(task.getUpdatedAt(), day)).count())
                .build())
            .toList();
    }

    private List<ChartPointResponse> taskStatusDistribution(List<Task> tasks) {
        return List.of(
            point("Todo", tasks.stream().filter(task -> task.getStatus() == TaskStatus.TODO).count()),
            point("In Progress", tasks.stream().filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS).count()),
            point("Review", tasks.stream().filter(task -> task.getStatus() == TaskStatus.REVIEW).count()),
            point("Done", tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count())
        );
    }

    private List<ChartPointResponse> monthlyActivity(List<Task> tasks) {
        int year = LocalDate.now().getYear();
        return java.util.stream.IntStream.rangeClosed(1, 12)
            .mapToObj(month -> ChartPointResponse.builder()
                .label(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                .value(tasks.stream().filter(task -> task.getCreatedAt() != null
                    && task.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getYear() == year
                    && task.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getMonthValue() == month).count())
                .build())
            .toList();
    }

    private List<ChartPointResponse> projectCompletionTrend(List<Project> projects) {
        return projects.stream()
            .limit(8)
            .map(project -> point(project.getName(), project.getProgress() == null ? 0 : project.getProgress()))
            .toList();
    }

    private ChartPointResponse point(String label, long value) {
        return ChartPointResponse.builder().label(label).value(value).build();
    }

    private boolean sameDay(java.time.Instant instant, LocalDate day) {
        return instant != null && instant.atZone(java.time.ZoneId.systemDefault()).toLocalDate().equals(day);
    }
}
