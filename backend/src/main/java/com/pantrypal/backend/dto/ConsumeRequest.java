package com.pantrypal.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ConsumeRequest {

    @NotNull(message = "Amount consumed is required")
    @DecimalMin(value = "0.01", message = "Amount consumed must be greater than zero")
    private BigDecimal amount;

    private String note;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}