package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.FoodItem;
import com.pantrypal.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    List<FoodItem> findByHousehold(Household household);

    Optional<FoodItem> findByIdAndHousehold(Long id, Household household);
}