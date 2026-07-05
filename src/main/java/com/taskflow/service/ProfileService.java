package com.taskflow.service;

import com.taskflow.dto.ProfileResponse;
import com.taskflow.dto.ProfileUpdateRequest;
import org.springframework.security.core.Authentication;

public interface ProfileService {
    ProfileResponse getProfile(Authentication authentication);

    ProfileResponse updateProfile(ProfileUpdateRequest request, Authentication authentication);
}
