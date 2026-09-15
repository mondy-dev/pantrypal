package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.AuthResponse;
import com.pantrypal.backend.dto.LoginRequest;
import com.pantrypal.backend.dto.RegisterRequest;
import com.pantrypal.backend.exception.AuthException;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.UserRepository;
import com.pantrypal.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldThrowException_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setFirstName("Test");
        request.setLastName("User");
        request.setPassword("password123");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        AuthException exception = assertThrows(AuthException.class, () -> authService.register(request));
        assertEquals("An account with this email already exists.", exception.getMessage());
    }

    @Test
    void register_shouldHashPasswordAndReturnToken_whenEmailIsNew() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setFirstName("Test");
        request.setLastName("User");
        request.setPassword("plainPassword");

        User savedUser = new User("Test",null, "User", "new@example.com", "hashedPassword");
        savedUser.setId(1L);

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(1L, "new@example.com")).thenReturn("fake-jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("new@example.com", response.getEmail());
    }

    @Test
    void login_shouldThrowException_whenPasswordIsIncorrect() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrongPassword");

        User existingUser = new User("Test",null, "User", "user@example.com", "correctHashedPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("wrongPassword", "correctHashedPassword")).thenReturn(false);

        AuthException exception = assertThrows(AuthException.class, () -> authService.login(request));
        assertEquals("Invalid email or password.", exception.getMessage());
    }

    @Test
    void login_shouldSucceed_whenCredentialsAreCorrect() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("correctPassword");

        User existingUser = new User("Test",null, "User", "user@example.com", "correctHashedPassword");
        existingUser.setId(5L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("correctPassword", "correctHashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(5L, "user@example.com")).thenReturn("fake-jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("user@example.com", response.getEmail());
    }
}