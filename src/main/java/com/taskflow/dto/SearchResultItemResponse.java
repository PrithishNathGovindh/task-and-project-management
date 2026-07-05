package com.taskflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResultItemResponse {
    private String id;
    private String title;
    private String subtitle;
    private String type;
    private String url;
}
