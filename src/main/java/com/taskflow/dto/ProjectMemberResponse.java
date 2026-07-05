package com.taskflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectMemberResponse {
    private String id;
    private String fullName;
    private String email;
    private String role;
    private Boolean owner;
}
