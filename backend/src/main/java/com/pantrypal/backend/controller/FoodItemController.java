package com.pantrypal.backend.controller;

import com.pantrypal.backend.dto.FoodItemRequest;
import com.pantrypal.backend.dto.FoodItemResponse;
import com.pantrypal.backend.exception.FoodItemException;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food")
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(Authentication authentication) {
        try {
            List<FoodItemResponse> items = foodItemService.getAllForHousehold(authentication.getName());
            return ResponseEntity.ok(items);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, Authentication authentication) {
        try {
            FoodItemResponse item = foodItemService.getById(authentication.getName(), id);
            return ResponseEntity.ok(item);
        } catch (FoodItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody FoodItemRequest request, Authentication authentication) {
        try {
            FoodItemResponse item = foodItemService.create(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (FoodItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody FoodItemRequest request,
            Authentication authentication) {
        try {
            FoodItemResponse item = foodItemService.update(authentication.getName(), id, request);
            return ResponseEntity.ok(item);
        } catch (FoodItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        try {
            foodItemService.delete(authentication.getName(), id);
            return ResponseEntity.noContent().build();
        } catch (FoodItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}