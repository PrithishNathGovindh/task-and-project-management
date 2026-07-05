package com.taskflow.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String bio;
    private Boolean notificationsEnabled;
    private String role;
    private Instant createdAt;
}
