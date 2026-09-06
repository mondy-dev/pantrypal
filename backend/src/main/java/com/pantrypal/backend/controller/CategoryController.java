package com.pantrypal.backend.controller;

import com.pantrypal.backend.dto.CategoryResponse;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<?> getCategories(Authentication authentication) {
        try {
            List<CategoryResponse> categories = categoryService.getCategoriesForCurrentUser(authentication.getName());
            return ResponseEntity.ok(categories);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String name = body.get("name");
            CategoryResponse response = categoryService.createCustomCategory(authentication.getName(), name);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}