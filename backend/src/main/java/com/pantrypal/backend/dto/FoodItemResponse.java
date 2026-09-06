package com.pantrypal.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FoodItemResponse {

    private Long id;
    private String name;
    private Long categoryId;
    private String categoryName;
    private String brand;
    private BigDecimal quantity;
    private String unit;
    private LocalDate purchaseDate;
    private LocalDate expirationDate;
    private String storageLocation;
    private BigDecimal minimumStock;
    private BigDecimal price;
    private String imageUrl;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FoodItemResponse(Long id, String name, Long categoryId, String categoryName, String brand,
            BigDecimal quantity, String unit, LocalDate purchaseDate, LocalDate expirationDate,
            String storageLocation, BigDecimal minimumStock, BigDecimal price, String imageUrl,
            String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.brand = brand;
        this.quantity = quantity;
        this.unit = unit;
        this.purchaseDate = purchaseDate;
        this.expirationDate = expirationDate;
        this.storageLocation = storageLocation;
        this.minimumStock = minimumStock;
        this.price = price;
        this.imageUrl = imageUrl;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getBrand() {
        return brand;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public BigDecimal getMinimumStock() {
        return minimumStock;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}