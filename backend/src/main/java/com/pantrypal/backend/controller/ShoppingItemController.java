package com.pantrypal.backend.controller;

import com.pantrypal.backend.dto.ShoppingItemRequest;
import com.pantrypal.backend.dto.ShoppingItemResponse;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.exception.ShoppingItemException;
import com.pantrypal.backend.service.ShoppingItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shopping-list")
public class ShoppingItemController {

    private final ShoppingItemService shoppingItemService;

    public ShoppingItemController(ShoppingItemService shoppingItemService) {
        this.shoppingItemService = shoppingItemService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(Authentication authentication) {
        try {
            List<ShoppingItemResponse> items = shoppingItemService.getAll(authentication.getName());
            return ResponseEntity.ok(items);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ShoppingItemRequest request, Authentication authentication) {
        try {
            ShoppingItemResponse item = shoppingItemService.create(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody ShoppingItemRequest request,
            Authentication authentication) {
        try {
            ShoppingItemResponse item = shoppingItemService.update(authentication.getName(), id, request);
            return ResponseEntity.ok(item);
        } catch (ShoppingItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> togglePurchased(@PathVariable Long id, Authentication authentication) {
        try {
            ShoppingItemResponse item = shoppingItemService.togglePurchased(authentication.getName(), id);
            return ResponseEntity.ok(item);
        } catch (ShoppingItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        try {
            shoppingItemService.delete(authentication.getName(), id);
            return ResponseEntity.noContent().build();
        } catch (ShoppingItemException | HouseholdException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}