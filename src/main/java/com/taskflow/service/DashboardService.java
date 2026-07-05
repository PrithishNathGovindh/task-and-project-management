package com.taskflow.service;

import com.taskflow.dto.DashboardResponse;
import org.springframework.security.core.Authentication;

public interface DashboardService {
    DashboardResponse getDashboard(Authentication authentication);
}
