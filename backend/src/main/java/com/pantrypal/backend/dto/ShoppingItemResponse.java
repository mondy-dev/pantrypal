package com.pantrypal.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ShoppingItemResponse {

    private Long id;
    private String name;
    private BigDecimal quantity;
    private String unit;
    private boolean purchased;
    private LocalDateTime createdAt;

    public ShoppingItemResponse(Long id, String name, BigDecimal quantity, String unit,
            boolean purchased, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.purchased = purchased;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public boolean isPurchased() {
        return purchased;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}