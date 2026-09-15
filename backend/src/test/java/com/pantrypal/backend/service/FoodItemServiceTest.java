package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.ConsumeRequest;
import com.pantrypal.backend.dto.FoodItemRequest;
import com.pantrypal.backend.dto.FoodItemResponse;
import com.pantrypal.backend.exception.FoodItemException;
import com.pantrypal.backend.model.*;
import com.pantrypal.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FoodItemServiceTest {

    @Mock
    private FoodItemRepository foodItemRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private HouseholdMemberRepository householdMemberRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InventoryHistoryRepository inventoryHistoryRepository;

    @InjectMocks
    private FoodItemService foodItemService;

    private User user;
    private Household household;
    private HouseholdMember membership;
    private Category category;

    private void setUpCommonMocks() {
        user = new User("Test", null, "User", "user@example.com", "hashed");
        household = new Household("Test Household");
        membership = new HouseholdMember(household, user, HouseholdRole.MEMBER);
        category = new Category("Canned Goods", null);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(householdMemberRepository.findByUser(user)).thenReturn(Optional.of(membership));
    }

    @Test
    void consume_shouldThrowException_whenAmountExceedsAvailableQuantity() {
        setUpCommonMocks();

        FoodItem foodItem = new FoodItem();
        foodItem.setName("Rice");
        foodItem.setQuantity(new BigDecimal("5"));
        foodItem.setUnit("kg");
        foodItem.setCategory(category);
        foodItem.setExpirationDate(LocalDate.now().plusDays(60));

        when(foodItemRepository.findByIdAndHousehold(1L, household)).thenReturn(Optional.of(foodItem));

        ConsumeRequest request = new ConsumeRequest();
        request.setAmount(new BigDecimal("10"));

        FoodItemException exception = assertThrows(FoodItemException.class,
                () -> foodItemService.consume("user@example.com", 1L, request));

        assertEquals("Cannot consume more than the available quantity.", exception.getMessage());
    }

    @Test
    void consume_shouldReduceQuantity_whenAmountIsValid() {
        setUpCommonMocks();

        FoodItem foodItem = new FoodItem();
        foodItem.setName("Rice");
        foodItem.setQuantity(new BigDecimal("10"));
        foodItem.setUnit("kg");
        foodItem.setCategory(category);
        foodItem.setExpirationDate(LocalDate.now().plusDays(60));

        when(foodItemRepository.findByIdAndHousehold(1L, household)).thenReturn(Optional.of(foodItem));

        ConsumeRequest request = new ConsumeRequest();
        request.setAmount(new BigDecimal("3"));

        FoodItemResponse response = foodItemService.consume("user@example.com", 1L, request);

        assertEquals(0, new BigDecimal("7").compareTo(response.getQuantity()));
    }

    @Test
    void create_shouldReturnFreshStatus_whenExpirationIsFarAway() {
        setUpCommonMocks();

        FoodItemRequest request = buildRequest(LocalDate.now().plusDays(60));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        FoodItemResponse response = foodItemService.create("user@example.com", request);

        assertEquals("FRESH", response.getExpirationStatus());
    }

    @Test
    void create_shouldReturnCriticalStatus_whenExpirationIsWithinAWeek() {
        setUpCommonMocks();

        FoodItemRequest request = buildRequest(LocalDate.now().plusDays(3));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        FoodItemResponse response = foodItemService.create("user@example.com", request);

        assertEquals("CRITICAL", response.getExpirationStatus());
    }

    @Test
    void create_shouldReturnExpiredStatus_whenExpirationDateHasPassed() {
        setUpCommonMocks();

        FoodItemRequest request = buildRequest(LocalDate.now().minusDays(2));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        FoodItemResponse response = foodItemService.create("user@example.com", request);

        assertEquals("EXPIRED", response.getExpirationStatus());
    }

    private FoodItemRequest buildRequest(LocalDate expirationDate) {
        FoodItemRequest request = new FoodItemRequest();
        request.setName("Test Item");
        request.setCategoryId(1L);
        request.setQuantity(new BigDecimal("5"));
        request.setUnit("pcs");
        request.setExpirationDate(expirationDate);
        return request;
    }
}