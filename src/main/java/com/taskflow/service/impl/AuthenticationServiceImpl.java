package com.taskflow.service.impl;

import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.dto.UserResponse;
import com.taskflow.exception.EmailAlreadyExistsException;
import com.taskflow.exception.InvalidCredentialsException;
import com.taskflow.exception.UserNotFoundException;
import com.taskflow.model.Role;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AuthenticationService;
import com.taskflow.util.JwtUtil;
import java.time.Instant;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthenticationServiceImpl(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
            .fullName(request.getFullName().trim())
            .email(email)
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.USER)
            .createdAt(Instant.now())
            .build();

        return toUserResponse(userRepository.save(user));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        return AuthResponse.builder()
            .token(jwtUtil.generateToken(user))
            .user(toUserResponse(user))
            .build();
    }

    @Override
    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .profilePicture(user.getProfilePicture())
            .bio(user.getBio())
            .notificationsEnabled(user.getNotificationsEnabled())
            .role(user.getRole().name())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
