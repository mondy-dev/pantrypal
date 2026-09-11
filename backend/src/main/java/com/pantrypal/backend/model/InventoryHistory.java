package com.pantrypal.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_history")
public class InventoryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "food_item_name", nullable = false)
    private String foodItemName;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @Column(name = "quantity_change", precision = 10, scale = 2)
    private BigDecimal quantityChange;

    private String unit;

    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public InventoryHistory() {
    }

    public InventoryHistory(Household household, User user, String foodItemName, ActionType actionType,
            BigDecimal quantityChange, String unit, String note) {
        this.household = household;
        this.user = user;
        this.foodItemName = foodItemName;
        this.actionType = actionType;
        this.quantityChange = quantityChange;
        this.unit = unit;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public Household getHousehold() {
        return household;
    }

    public User getUser() {
        return user;
    }

    public String getFoodItemName() {
        return foodItemName;
    }

    public ActionType getActionType() {
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