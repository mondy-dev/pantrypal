package com.pantrypal.backend.dto;

import com.pantrypal.backend.model.StorageLocation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FoodItemRequest {

    @NotBlank(message = "Food name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String brand;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0", message = "Quantity cannot be negative")
    private BigDecimal quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    private LocalDate purchaseDate;

    @NotNull(message = "Expiration date is required")
    private LocalDate expirationDate;

    private StorageLocation storageLocation;

    @DecimalMin(value = "0.0", message = "Minimum stock cannot be negative")
    private BigDecimal minimumStock;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;

    private String imageUrl;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    // --- Getters and Setters ---

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
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

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public StorageLocation getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(StorageLocation storageLocation) {
        this.storageLocation = storageLocation;
    }

    public BigDecimal getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(BigDecimal minimumStock) {
        this.minimumStock = minimumStock;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}