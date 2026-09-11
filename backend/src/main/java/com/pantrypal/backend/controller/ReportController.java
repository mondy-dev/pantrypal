package com.pantrypal.backend.controller;

import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventoryReport(Authentication authentication) {
        try {
            return ResponseEntity.ok(reportService.getInventoryReport(authentication.getName()));
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/expiration")
    public ResponseEntity<?> getExpirationReport(Authentication authentication) {
        try {
            return ResponseEntity.ok(reportService.getExpirationReport(authentication.getName()));
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/consumption")
    public ResponseEntity<?> getConsumptionReport(Authentication authentication) {
        try {
            return ResponseEntity.ok(reportService.getConsumptionReport(authentication.getName()));
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/waste")
    public ResponseEntity<?> getWasteReport(Authentication authentication) {
        try {
            return ResponseEntity.ok(reportService.getWasteReport(authentication.getName()));
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}