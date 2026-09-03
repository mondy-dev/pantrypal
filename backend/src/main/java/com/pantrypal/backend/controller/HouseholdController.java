package com.pantrypal.backend.controller;

import com.pantrypal.backend.dto.CreateHouseholdRequest;
import com.pantrypal.backend.dto.HouseholdResponse;
import com.pantrypal.backend.dto.InviteMemberRequest;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.service.HouseholdService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @PostMapping
    public ResponseEntity<?> createHousehold(@Valid @RequestBody CreateHouseholdRequest request,
            Authentication authentication) {
        try {
            HouseholdResponse response = householdService.createHousehold(authentication.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyHousehold(Authentication authentication) {
        try {
            HouseholdResponse response = householdService.getMyHousehold(authentication.getName());
            return ResponseEntity.ok(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteMember(@Valid @RequestBody InviteMemberRequest request,
            Authentication authentication) {
        try {
            HouseholdResponse response = householdService.inviteMember(authentication.getName(), request);
            return ResponseEntity.ok(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long userId, Authentication authentication) {
        try {
            HouseholdResponse response = householdService.removeMember(authentication.getName(), userId);
            return ResponseEntity.ok(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> renameHousehold(@Valid @RequestBody CreateHouseholdRequest request,
            Authentication authentication) {
        try {
            HouseholdResponse response = householdService.renameHousehold(authentication.getName(), request);
            return ResponseEntity.ok(response);
        } catch (HouseholdException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}