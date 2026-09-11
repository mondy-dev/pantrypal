package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {

    List<InventoryHistory> findByHouseholdOrderByCreatedAtDesc(Household household);
}