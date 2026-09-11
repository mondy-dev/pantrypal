package com.pantrypal.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HistoryResponse {

    private Long id;
    private String userName;
    private String foodItemName;
    private String actionType;
    private BigDecimal quantityChange;
    private String unit;
    private String note;
    private LocalDateTime createdAt;

    public HistoryResponse(Long id, String userName, String foodItemName, String actionType,
            BigDecimal quantityChange, String unit, String note, LocalDateTime createdAt) {
        this.id = id;
        this.userName = userName;
        this.foodItemName = foodItemName;
        this.actionType = actionType;
        this.quantityChange = quantityChange;
        this.unit = unit;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getFoodItemName() {
        return foodItemName;
    }

    public String getActionType() {
        return actionType;
    }

    public BigDecimal getQuantityChange() {
        return quantityChange;
    }

    public String getUnit() {
        return unit;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}