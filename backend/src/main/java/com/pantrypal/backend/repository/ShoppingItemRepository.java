package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {

    List<ShoppingItem> findByHousehold(Household household);

    Optional<ShoppingItem> findByIdAndHousehold(Long id, Household household);
}