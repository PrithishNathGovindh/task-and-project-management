package com.taskflow.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters")
    private String fullName;

    private String profilePicture;
    private String bio;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Boolean notificationsEnabled;
}
