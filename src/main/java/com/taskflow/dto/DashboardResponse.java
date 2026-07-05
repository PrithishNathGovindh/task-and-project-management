package com.taskflow.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private List<TaskResponse> todaysTasks;
    private List<ProjectResponse> recentProjects;
    private List<TaskResponse> upcomingDeadlines;
    private long taskCount;
    private long projectCount;
    private long completedTasks;
    private long pendingTasks;
}
