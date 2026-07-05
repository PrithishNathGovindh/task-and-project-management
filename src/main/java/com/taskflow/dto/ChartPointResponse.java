package com.taskflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChartPointResponse {
    private String label;
    private long value;
}
