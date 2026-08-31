package com.pantrypal.backend.dto;

public class AuthResponse {

    private String token;
    private Long userId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;

    public AuthResponse(String token, Long userId, String firstName, String middleName, String lastName, String email) {
        this.token = token;
        this.userId = userId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }
}