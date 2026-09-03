package com.pantrypal.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateHouseholdRequest {

    @NotBlank(message = "Household name is required")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}