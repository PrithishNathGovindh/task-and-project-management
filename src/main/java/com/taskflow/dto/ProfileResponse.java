package com.taskflow.dto;

import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private String id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String bio;
    private String role;
    private Instant memberSince;
    private int currentStreak;
    private Boolean notificationsEnabled;
    private AnalyticsResponse statistics;
    private List<String> achievements;
    private List<ProjectResponse> recentProjects;
    private List<ProjectResponse> completedProjects;
    private List<TaskResponse> recentlyFinishedTasks;
}
