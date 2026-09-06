package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.Category;
import com.pantrypal.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByHouseholdIsNull();

    List<Category> findByHousehold(Household household);

    boolean existsByNameAndHouseholdIsNull(String name);
}