package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.*;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.model.*;
import com.pantrypal.backend.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final FoodItemRepository foodItemRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public ReportService(FoodItemRepository foodItemRepository,
            InventoryHistoryRepository inventoryHistoryRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository) {
        this.foodItemRepository = foodItemRepository;
        this.inventoryHistoryRepository = inventoryHistoryRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
    }

    public InventoryReportResponse getInventoryReport(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        List<FoodItem> items = foodItemRepository.findByHousehold(household);

        Map<String, Long> byCategory = items.stream()
                .collect(Collectors.groupingBy(i -> i.getCategory().getName(), Collectors.counting()));

        Map<String, Long> byStorage = items.stream()
                .filter(i -> i.getStorageLocation() != null)
                .collect(Collectors.groupingBy(i -> i.getStorageLocation().name(), Collectors.counting()));

        return new InventoryReportResponse(items.size(), byCategory, byStorage);
    }

    public ExpirationReportResponse getExpirationReport(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        List<FoodItem> items = foodItemRepository.findByHousehold(household);

        long expired = 0;
        long expiringThisWeek = 0;
        long expiringThisMonth = 0;

        for (FoodItem item : items) {
            long days = ChronoUnit.DAYS.between(LocalDate.now(), item.getExpirationDate());
            if (days < 0) {
                expired++;
            } else if (days <= 7) {
                expiringThisWeek++;
            } else if (days <= 30) {
                expiringThisMonth++;
            }
        }

        return new ExpirationReportResponse(expired, expiringThisWeek, expiringThisMonth);
    }

    public ConsumptionReportResponse getConsumptionReport(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        List<InventoryHistory> consumedEntries = inventoryHistoryRepository
                .findByHouseholdOrderByCreatedAtDesc(household)
                .stream()
                .filter(h -> h.getActionType() == ActionType.CONSUMED)
                .toList();

        Map<String, List<InventoryHistory>> grouped = consumedEntries.stream()
                .collect(Collectors.groupingBy(h -> h.getFoodItemName()));

        List<ConsumptionReportResponse.ConsumedFoodEntry> result = grouped.entrySet().stream()
                .map(entry -> {
                    BigDecimal total = entry.getValue().stream()
                            .map(h -> h.getQuantityChange())
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));
                    return new ConsumptionReportResponse.ConsumedFoodEntry(entry.getKey(), total,
                            entry.getValue().size());
                })
                .sorted((a, b) -> b.getTotalQuantityConsumed().compareTo(a.getTotalQuantityConsumed()))
                .limit(10)
                .toList();

        return new ConsumptionReportResponse(result);
    }

    public WasteReportResponse getWasteReport(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        List<InventoryHistory> deletedEntries = inventoryHistoryRepository
                .findByHouseholdOrderByCreatedAtDesc(household)
                .stream()
                .filter(h -> h.getActionType() == ActionType.DELETED)
                .toList();

        long wastedCount = deletedEntries.stream()
                .filter(h -> h.getWasteReason() != null && h.getWasteReason() != WasteReason.CONSUMED)
                .count();

        long consumedFullyCount = deletedEntries.stream()
                .filter(h -> h.getWasteReason() == WasteReason.CONSUMED)
                .count();

        BigDecimal estimatedValue = deletedEntries.stream()
                .filter(h -> h.getWasteReason() != null && h.getWasteReason() != WasteReason.CONSUMED)
                .map(h -> h.getPriceSnapshot())
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        return new WasteReportResponse(wastedCount, consumedFullyCount, estimatedValue);
    }

    private Household getHouseholdForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        return membership.getHousehold();
    }
}