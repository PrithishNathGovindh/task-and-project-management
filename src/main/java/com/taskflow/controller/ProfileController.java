package com.taskflow.controller;

import com.taskflow.dto.ProfileResponse;
import com.taskflow.dto.ProfileUpdateRequest;
import com.taskflow.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getProfile(authentication));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
        @Valid @RequestBody ProfileUpdateRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(profileService.updateProfile(request, authentication));
    }
}
