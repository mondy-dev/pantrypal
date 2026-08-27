package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.AuthResponse;
import com.pantrypal.backend.dto.LoginRequest;
import com.pantrypal.backend.dto.RegisterRequest;
import com.pantrypal.backend.exception.AuthException;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.UserRepository;
import com.pantrypal.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("An account with this email already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getEmail(), hashedPassword);
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}