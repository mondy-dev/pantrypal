package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.FoodItemRequest;
import com.pantrypal.backend.dto.FoodItemResponse;
import com.pantrypal.backend.exception.FoodItemException;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.model.Category;
import com.pantrypal.backend.model.FoodItem;
import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.CategoryRepository;
import com.pantrypal.backend.repository.FoodItemRepository;
import com.pantrypal.backend.repository.HouseholdMemberRepository;
import com.pantrypal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.pantrypal.backend.model.ExpirationStatus;
import com.pantrypal.backend.dto.ConsumeRequest;
import com.pantrypal.backend.dto.HistoryResponse;
import com.pantrypal.backend.model.ActionType;
import com.pantrypal.backend.model.InventoryHistory;
import com.pantrypal.backend.repository.InventoryHistoryRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.util.List;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;

    public FoodItemService(FoodItemRepository foodItemRepository,
            CategoryRepository categoryRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository,
            InventoryHistoryRepository inventoryHistoryRepository) {
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
        this.inventoryHistoryRepository = inventoryHistoryRepository;
    }

    public List<FoodItemResponse> getAllForHousehold(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        return foodItemRepository.findByHousehold(household).stream()
                .map(this::buildResponse)
                .toList();
    }

    public FoodItemResponse getById(String requesterEmail, Long foodItemId) {
        Household household = getHouseholdForUser(requesterEmail);
        FoodItem foodItem = foodItemRepository.findByIdAndHousehold(foodItemId, household)
                .orElseThrow(() -> new FoodItemException("Food item not found."));
        return buildResponse(foodItem);
    }

    public FoodItemResponse create(String requesterEmail, FoodItemRequest request) {
        User user = getUserByEmail(requesterEmail);
        Household household = getHouseholdForUser(requesterEmail);
        Category category = getValidCategory(request.getCategoryId(), household);

        FoodItem foodItem = new FoodItem();
        applyRequestToEntity(foodItem, request, category);
        foodItem.setHousehold(household);

        foodItemRepository.save(foodItem);

        logHistory(household, user, foodItem.getName(), ActionType.ADDED, foodItem.getQuantity(), foodItem.getUnit(),
                null);

        return buildResponse(foodItem);
    }

    public FoodItemResponse update(String requesterEmail, Long foodItemId, FoodItemRequest request) {
        Household household = getHouseholdForUser(requesterEmail);
        FoodItem foodItem = foodItemRepository.findByIdAndHousehold(foodItemId, household)
                .orElseThrow(() -> new FoodItemException("Food item not found."));

        Category category = getValidCategory(request.getCategoryId(), household);
        applyRequestToEntity(foodItem, request, category);

        foodItemRepository.save(foodItem);
        return buildResponse(foodItem);
    }

    public void delete(String requesterEmail, Long foodItemId) {
        User user = getUserByEmail(requesterEmail);
        Household household = getHouseholdForUser(requesterEmail);
        FoodItem foodItem = foodItemRepository.findByIdAndHousehold(foodItemId, household)
                .orElseThrow(() -> new FoodItemException("Food item not found."));

        logHistory(household, user, foodItem.getName(), ActionType.DELETED, null, foodItem.getUnit(), null);

        foodItemRepository.delete(foodItem);
    }

    public FoodItemResponse consume(String requesterEmail, Long foodItemId, ConsumeRequest request) {
        User user = getUserByEmail(requesterEmail);
        Household household = getHouseholdForUser(requesterEmail);
        FoodItem foodItem = foodItemRepository.findByIdAndHousehold(foodItemId, household)
                .orElseThrow(() -> new FoodItemException("Food item not found."));

        if (request.getAmount().compareTo(foodItem.getQuantity()) > 0) {
            throw new FoodItemException("Cannot consume more than the available quantity.");
        }

        BigDecimal newQuantity = foodItem.getQuantity().subtract(request.getAmount());
        foodItem.setQuantity(newQuantity);
        foodItemRepository.save(foodItem);

        logHistory(household, user, foodItem.getName(), ActionType.CONSUMED, request.getAmount(), foodItem.getUnit(),
                request.getNote());

        return buildResponse(foodItem);
    }

    public List<HistoryResponse> getHistory(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);

        return inventoryHistoryRepository.findByHouseholdOrderByCreatedAtDesc(household).stream()
                .map(h -> new HistoryResponse(
                        h.getId(),
                        h.getUser().getFirstName() + " " + h.getUser().getLastName(),
                        h.getFoodItemName(),
                        h.getActionType().name(),
                        h.getQuantityChange(),
                        h.getUnit(),
                        h.getNote(),
                        h.getCreatedAt()))
                .toList();
    }

    private void logHistory(Household household, User user, String foodItemName, ActionType actionType,
            BigDecimal quantityChange, String unit, String note) {
        InventoryHistory history = new InventoryHistory(household, user, foodItemName, actionType, quantityChange, unit,
                note);
        inventoryHistoryRepository.save(history);
    }

    private void applyRequestToEntity(FoodItem foodItem, FoodItemRequest request, Category category) {
        foodItem.setName(request.getName());
        foodItem.setCategory(category);
        foodItem.setBrand(request.getBrand());
        foodItem.setQuantity(request.getQuantity());
        foodItem.setUnit(request.getUnit());
        foodItem.setPurchaseDate(request.getPurchaseDate());
        foodItem.setExpirationDate(request.getExpirationDate());
        foodItem.setStorageLocation(request.getStorageLocation());
        foodItem.setMinimumStock(request.getMinimumStock());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setNotes(request.getNotes());
    }

    private Category getValidCategory(Long categoryId, Household household) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new FoodItemException("Category not found."));

        boolean isGlobalDefault = category.getHousehold() == null;
        boolean belongsToThisHousehold = category.getHousehold() != null
                && category.getHousehold().getId().equals(household.getId());

        if (!isGlobalDefault && !belongsToThisHousehold) {
            throw new FoodItemException("That category does not belong to your household.");
        }

        return category;
    }

    private Household getHouseholdForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        return membership.getHousehold();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));
    }

    private FoodItemResponse buildResponse(FoodItem foodItem) {
        long daysUntilExpiration = ChronoUnit.DAYS.between(LocalDate.now(), foodItem.getExpirationDate());
        ExpirationStatus status = calculateStatus(daysUntilExpiration);

        return new FoodItemResponse(
                foodItem.getId(),
                foodItem.getName(),
                foodItem.getCategory().getId(),
                foodItem.getCategory().getName(),
                foodItem.getBrand(),
                foodItem.getQuantity(),
                foodItem.getUnit(),
                foodItem.getPurchaseDate(),
                foodItem.getExpirationDate(),
                foodItem.getStorageLocation() != null ? foodItem.getStorageLocation().name() : null,
                foodItem.getMinimumStock(),
                foodItem.getPrice(),
                foodItem.getImageUrl(),
                foodItem.getNotes(),
                foodItem.getCreatedAt(),
                foodItem.getUpdatedAt(),
                status.name(),
                daysUntilExpiration);
    }

    private ExpirationStatus calculateStatus(long daysUntilExpiration) {
        if (daysUntilExpiration < 0) {
            return ExpirationStatus.EXPIRED;
        } else if (daysUntilExpiration <= 7) {
            return ExpirationStatus.CRITICAL;
        } else if (daysUntilExpiration <= 30) {
            return ExpirationStatus.EXPIRING_SOON;
        } else {
            return ExpirationStatus.FRESH;
        }
    }
}
