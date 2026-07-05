package com.taskflow.service;

import com.taskflow.dto.SearchResponse;
import org.springframework.security.core.Authentication;

public interface SearchService {
    SearchResponse search(String query, Authentication authentication);
}
