package com.taskflow.controller;

import com.taskflow.dto.AiGeneratedTaskResponse;
import com.taskflow.dto.AiTaskGenerationRequest;
import com.taskflow.service.AiTaskGeneratorService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/tasks")
public class AiTaskGeneratorController {

    private final AiTaskGeneratorService aiTaskGeneratorService;

    public AiTaskGeneratorController(AiTaskGeneratorService aiTaskGeneratorService) {
        this.aiTaskGeneratorService = aiTaskGeneratorService;
    }

    @PostMapping
    public ResponseEntity<List<AiGeneratedTaskResponse>> generateTasks(@Valid @RequestBody AiTaskGenerationRequest request) {
        return ResponseEntity.ok(aiTaskGeneratorService.generateTasks(request));
    }
}
