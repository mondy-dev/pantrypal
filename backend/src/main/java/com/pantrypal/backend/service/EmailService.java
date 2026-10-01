package com.pantrypal.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;

        String body = "<div style=\"font-family: sans-serif; max-width: 480px; margin: 0 auto;\">"
                + "<h2 style=\"color: #2f4b3c;\">Welcome to PantryPal, " + firstName + "!</h2>"
                + "<p>Please confirm your email address to activate your account.</p>"
                + "<p><a href=\"" + link + "\" style=\"display: inline-block; padding: 12px 24px; "
                + "background: #2f4b3c; color: white; text-decoration: none; border-radius: 6px;\">"
                + "Verify My Email</a></p>"
                + "<p style=\"color: #746b5d; font-size: 13px;\">If the button doesn't work, copy and paste this link: "
                + link + "</p>"
                + "</div>";

        send(toEmail, "Verify your PantryPal account", body);
    }

    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;

        String body = "<div style=\"font-family: sans-serif; max-width: 480px; margin: 0 auto;\">"
                + "<h2 style=\"color: #2f4b3c;\">Reset your PantryPal password</h2>"
                + "<p>Hi " + firstName + ", we received a request to reset your password.</p>"
                + "<p><a href=\"" + link + "\" style=\"display: inline-block; padding: 12px 24px; "
                + "background: #2f4b3c; color: white; text-decoration: none; border-radius: 6px;\">"
                + "Reset My Password</a></p>"
                + "<p style=\"color: #746b5d; font-size: 13px;\">If you didn't request this, you can safely ignore this email. "
                + "This link expires in 1 hour.</p>"
                + "</div>";

        send(toEmail, "Reset your PantryPal password", body);
    }

    private void send(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}