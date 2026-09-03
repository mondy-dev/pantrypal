package com.pantrypal.backend.repository;

import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, Long> {

    Optional<HouseholdMember> findByUser(User user);

    boolean existsByUser(User user);

    List<HouseholdMember> findByHousehold(Household household);

    Optional<HouseholdMember> findByHouseholdAndUser_Id(Household household, Long userId);
}