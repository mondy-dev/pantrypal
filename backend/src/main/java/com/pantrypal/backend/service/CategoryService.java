package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.CategoryResponse;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.model.Category;
import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.CategoryRepository;
import com.pantrypal.backend.repository.HouseholdMemberRepository;
import com.pantrypal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryResponse> getCategoriesForCurrentUser(String requesterEmail) {
        Household household = getHouseholdForUser(requesterEmail);

        List<CategoryResponse> result = new ArrayList<>();

        categoryRepository.findByHouseholdIsNull()
                .forEach(c -> result.add(new CategoryResponse(c.getId(), c.getName(), true)));

        categoryRepository.findByHousehold(household)
                .forEach(c -> result.add(new CategoryResponse(c.getId(), c.getName(), false)));

        return result;
    }

    public CategoryResponse createCustomCategory(String requesterEmail, String name) {
        Household household = getHouseholdForUser(requesterEmail);

        Category category = new Category(name, household);
        categoryRepository.save(category);

        return new CategoryResponse(category.getId(), category.getName(), false);
    }

    private Household getHouseholdForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        return membership.getHousehold();
    }
}