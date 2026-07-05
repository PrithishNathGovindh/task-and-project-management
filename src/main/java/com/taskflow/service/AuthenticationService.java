package com.taskflow.service;

import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.dto.UserResponse;
import org.springframework.security.core.Authentication;

public interface AuthenticationService {
    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getCurrentUser(Authentication authentication);
}
