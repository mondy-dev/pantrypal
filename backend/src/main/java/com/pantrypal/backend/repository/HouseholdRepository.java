package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdRepository extends JpaRepository<Household, Long> {
}