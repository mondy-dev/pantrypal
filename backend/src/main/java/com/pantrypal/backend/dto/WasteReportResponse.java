package com.pantrypal.backend.dto;

import java.math.BigDecimal;

public class WasteReportResponse {

    private long wastedItemCount;
    private long consumedFullyCount;
    private BigDecimal estimatedWasteValue;

    public WasteReportResponse(long wastedItemCount, long consumedFullyCount, BigDecimal estimatedWasteValue) {
        this.wastedItemCount = wastedItemCount;
        this.consumedFullyCount = consumedFullyCount;
        this.estimatedWasteValue = estimatedWasteValue;
    }

    public long getWastedItemCount() {
        return wastedItemCount;
    }

    public long getConsumedFullyCount() {
        return consumedFullyCount;
    }

    public BigDecimal getEstimatedWasteValue() {
        return estimatedWasteValue;
    }
}