package com.pantrypal.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ConsumptionReportResponse {

    public static class ConsumedFoodEntry {
        private String foodItemName;
        private BigDecimal totalQuantityConsumed;
        private long timesConsumed;

        public ConsumedFoodEntry(String foodItemName, BigDecimal totalQuantityConsumed, long timesConsumed) {
            this.foodItemName = foodItemName;
            this.totalQuantityConsumed = totalQuantityConsumed;
            this.timesConsumed = timesConsumed;
        }

        public String getFoodItemName() {
            return foodItemName;
        }

        public BigDecimal getTotalQuantityConsumed() {
            return totalQuantityConsumed;
        }

        public long getTimesConsumed() {
            return timesConsumed;
        }
    }

    private List<ConsumedFoodEntry> mostConsumed;

    public ConsumptionReportResponse(List<ConsumedFoodEntry> mostConsumed) {
        this.mostConsumed = mostConsumed;
    }

    public List<ConsumedFoodEntry> getMostConsumed() {
        return mostConsumed;
    }
}