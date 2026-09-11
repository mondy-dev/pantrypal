package com.pantrypal.backend.dto;

import java.util.Map;

public class InventoryReportResponse {

    private long totalItems;
    private Map<String, Long> itemsByCategory;
    private Map<String, Long> itemsByStorageLocation;

    public InventoryReportResponse(long totalItems, Map<String, Long> itemsByCategory,
            Map<String, Long> itemsByStorageLocation) {
        this.totalItems = totalItems;
        this.itemsByCategory = itemsByCategory;
        this.itemsByStorageLocation = itemsByStorageLocation;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public Map<String, Long> getItemsByCategory() {
        return itemsByCategory;
    }

    public Map<String, Long> getItemsByStorageLocation() {
        return itemsByStorageLocation;
    }
}