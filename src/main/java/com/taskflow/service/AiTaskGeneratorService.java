package com.taskflow.service;

import com.taskflow.dto.AiGeneratedTaskResponse;
import com.taskflow.dto.AiTaskGenerationRequest;
import java.util.List;

public interface AiTaskGeneratorService {
    List<AiGeneratedTaskResponse> generateTasks(AiTaskGenerationRequest request);
}
