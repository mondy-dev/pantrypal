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

import java.util.List;

@Service
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public FoodItemService(FoodItemRepository foodItemRepository,
            CategoryRepository categoryRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository) {
        this.foodItemRepository = foodItemRepository;
        this.categoryRepository = categoryRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
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
        Household household = getHouseholdForUser(requesterEmail);
        Category category = getValidCategory(request.getCategoryId(), household);

        FoodItem foodItem = new FoodItem();
        applyRequestToEntity(foodItem, request, category);
        foodItem.setHousehold(household);

        foodItemRepository.save(foodItem);
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
        Household household = getHouseholdForUser(requesterEmail);
        FoodItem foodItem = foodItemRepository.findByIdAndHousehold(foodItemId, household)
                .orElseThrow(() -> new FoodItemException("Food item not found."));

        foodItemRepository.delete(foodItem);
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

    private FoodItemResponse buildResponse(FoodItem foodItem) {
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
                foodItem.getUpdatedAt());
    }
}