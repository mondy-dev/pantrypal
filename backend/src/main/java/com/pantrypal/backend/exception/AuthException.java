package com.pantrypal.backend.exception;

public class AuthException extends RuntimeException {

    public AuthException(String message) {
        super(message);
    }
}