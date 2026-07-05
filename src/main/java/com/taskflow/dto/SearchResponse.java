package com.taskflow.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponse {
    private List<SearchResultItemResponse> projects;
    private List<SearchResultItemResponse> tasks;
    private List<SearchResultItemResponse> members;
}
