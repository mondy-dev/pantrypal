package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.ShoppingItemRequest;
import com.pantrypal.backend.dto.ShoppingItemResponse;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.exception.ShoppingItemException;
import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.ShoppingItem;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.HouseholdMemberRepository;
import com.pantrypal.backend.repository.ShoppingItemRepository;
import com.pantrypal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingItemService {

    private final ShoppingItemRepository shoppingItemRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public ShoppingItemService(ShoppingItemRepository shoppingItemRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository) {
        this.shoppingItemRepository = shoppingItemRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
    }

    public List<ShoppingItemResponse> getAll(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);
        return shoppingItemRepository.findByHousehold(household).stream()
                .map(this::buildResponse)
                .toList();
    }

    public ShoppingItemResponse create(String requesterEmail, ShoppingItemRequest request) {
        Household household = getHouseholdForUser(requesterEmail);

        ShoppingItem item = new ShoppingItem(request.getName(), request.getQuantity(), request.getUnit(), household);
        shoppingItemRepository.save(item);

        return buildResponse(item);
    }

    public ShoppingItemResponse update(String requesterEmail, Long itemId, ShoppingItemRequest request) {
        Household household = getHouseholdForUser(requesterEmail);
        ShoppingItem item = shoppingItemRepository.findByIdAndHousehold(itemId, household)
                .orElseThrow(() -> new ShoppingItemException("Shopping item not found."));

        item.setName(request.getName());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());

        shoppingItemRepository.save(item);
        return buildResponse(item);
    }

    public ShoppingItemResponse togglePurchased(String requesterEmail, Long itemId) {
        Household household = getHouseholdForUser(requesterEmail);
        ShoppingItem item = shoppingItemRepository.findByIdAndHousehold(itemId, household)
                .orElseThrow(() -> new ShoppingItemException("Shopping item not found."));

        item.setPurchased(!item.isPurchased());
        shoppingItemRepository.save(item);

        return buildResponse(item);
    }

    public void delete(String requesterEmail, Long itemId) {
        Household household = getHouseholdForUser(requesterEmail);
        ShoppingItem item = shoppingItemRepository.findByIdAndHousehold(itemId, household)
                .orElseThrow(() -> new ShoppingItemException("Shopping item not found."));

        shoppingItemRepository.delete(item);
    }

    private Household getHouseholdForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        return membership.getHousehold();
    }

    private ShoppingItemResponse buildResponse(ShoppingItem item) {
        return new ShoppingItemResponse(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getUnit(),
                item.isPurchased(),
                item.getCreatedAt());
    }
}