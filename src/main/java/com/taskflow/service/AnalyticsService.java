package com.taskflow.service;

import com.taskflow.dto.AnalyticsResponse;
import org.springframework.security.core.Authentication;

public interface AnalyticsService {
    AnalyticsResponse getAnalytics(Authentication authentication);
}
