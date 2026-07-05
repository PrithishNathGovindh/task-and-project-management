package com.taskflow.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsResponse {
    private long totalProjects;
    private long completedProjects;
    private long pendingProjects;
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private int completionPercentage;
    private int productivityScore;
    private List<ChartPointResponse> weeklyProductivity;
    private List<ChartPointResponse> taskStatusDistribution;
    private List<ChartPointResponse> monthlyActivity;
    private List<ChartPointResponse> projectCompletionTrend;
}
