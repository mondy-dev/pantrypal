package com.pantrypal.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class ShoppingItemRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    private BigDecimal quantity;

    private String unit;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}