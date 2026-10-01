package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.AuthResponse;
import com.pantrypal.backend.dto.LoginRequest;
import com.pantrypal.backend.dto.RegisterRequest;
import com.pantrypal.backend.exception.AuthException;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.UserRepository;
import com.pantrypal.backend.security.JwtUtil;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("An account with this email already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getFirstName(), request.getMiddleName(), request.getLastName(), request.getEmail(),
                hashedPassword);

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);
        } catch (RuntimeException e) {
            // The address was rejected (e.g. bad domain, or a provider like Gmail that
            // validates the mailbox synchronously). Don't leave a dangling,
            // unverifiable account behind — roll the registration back.
            userRepository.delete(user);
            throw new AuthException(
                    "We couldn't send a verification email to this address. Please check that it's correct.");
        }
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new AuthException("Invalid or expired verification link."));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException("This verification link has expired. Please register again.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
        });
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new AuthException("Invalid or expired reset link."));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AuthException("This reset link has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password.");
        }

        if (!user.isEmailVerified()) {
            throw new AuthException(
                    "Please verify your email before logging in. Check your inbox for the verification link.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getFirstName(), user.getMiddleName(), user.getLastName(),
                user.getEmail());
    }
}