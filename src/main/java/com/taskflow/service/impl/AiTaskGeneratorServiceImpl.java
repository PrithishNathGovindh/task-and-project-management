package com.taskflow.service.impl;

import com.taskflow.dto.AiGeneratedTaskResponse;
import com.taskflow.dto.AiTaskGenerationRequest;
import com.taskflow.model.TaskPriority;
import com.taskflow.service.AiTaskGeneratorService;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class AiTaskGeneratorServiceImpl implements AiTaskGeneratorService {

    @Override
    public List<AiGeneratedTaskResponse> generateTasks(AiTaskGenerationRequest request) {
        String idea = request.getIdea().trim();
        String normalizedIdea = idea.toLowerCase(Locale.ENGLISH);
        List<AiGeneratedTaskResponse> tasks = new ArrayList<>();

        tasks.add(task("Requirement Analysis", "Define goals, users, constraints, and acceptance criteria for " + idea + ".", TaskPriority.HIGH));
        tasks.add(task("UI/UX Design", "Create user flows, responsive screens, and interaction states.", TaskPriority.MEDIUM));
        tasks.add(task("Database Design", "Model core entities, relationships, indexes, and validation rules.", TaskPriority.HIGH));
        tasks.add(task("Authentication", "Plan secure registration, login, session handling, and role-based access.", TaskPriority.HIGH));

        if (containsAny(normalizedIdea, "e-commerce", "ecommerce", "shop", "store", "commerce")) {
            tasks.add(task("Product Management", "Build product catalog, categories, inventory fields, and product detail flows.", TaskPriority.HIGH));
            tasks.add(task("Shopping Cart", "Implement cart updates, quantity changes, totals, and persistence.", TaskPriority.HIGH));
            tasks.add(task("Payment Integration", "Integrate checkout, payment status handling, and order confirmation.", TaskPriority.HIGH));
        } else if (containsAny(normalizedIdea, "dashboard", "analytics", "report")) {
            tasks.add(task("Analytics Metrics", "Define key metrics, filters, summaries, and data refresh expectations.", TaskPriority.HIGH));
            tasks.add(task("Chart Components", "Create reusable line, bar, pie, and trend visualizations.", TaskPriority.MEDIUM));
        } else if (containsAny(normalizedIdea, "mobile", "android", "ios", "app")) {
            tasks.add(task("Mobile Navigation", "Design tab structure, deep links, and responsive mobile flows.", TaskPriority.MEDIUM));
            tasks.add(task("Offline States", "Handle loading, retries, empty states, and interrupted connectivity.", TaskPriority.MEDIUM));
        } else {
            tasks.add(task("Core Feature Development", "Implement the primary workflow and reusable components.", TaskPriority.HIGH));
            tasks.add(task("Admin Controls", "Add management actions, validation, and protected access where needed.", TaskPriority.MEDIUM));
        }

        tasks.add(task("Testing", "Cover happy paths, edge cases, validation, and regression-sensitive flows.", TaskPriority.MEDIUM));
        tasks.add(task("Deployment", "Prepare environment settings, build verification, and release checklist.", TaskPriority.MEDIUM));
        return tasks;
    }

    private boolean containsAny(String value, String... needles) {
        for (String needle : needles) {
            if (value.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    private AiGeneratedTaskResponse task(String title, String description, TaskPriority priority) {
        return AiGeneratedTaskResponse.builder()
            .title(title)
            .description(description)
            .priority(priority)
            .build();
    }
}
