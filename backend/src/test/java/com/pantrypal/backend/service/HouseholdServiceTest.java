package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.CreateHouseholdRequest;
import com.pantrypal.backend.dto.InviteMemberRequest;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.HouseholdRole;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.HouseholdMemberRepository;
import com.pantrypal.backend.repository.HouseholdRepository;
import com.pantrypal.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HouseholdServiceTest {

    @Mock
    private HouseholdRepository householdRepository;

    @Mock
    private HouseholdMemberRepository householdMemberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HouseholdService householdService;

    @Test
    void createHousehold_shouldThrowException_whenUserAlreadyBelongsToOne() {
        User user = new User("Test", null, "User", "user@example.com", "hashed");
        CreateHouseholdRequest request = new CreateHouseholdRequest();
        request.setName("New Household");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(householdMemberRepository.existsByUser(user)).thenReturn(true);

        HouseholdException exception = assertThrows(HouseholdException.class,
                () -> householdService.createHousehold("user@example.com", request));

        assertEquals("You already belong to a household.", exception.getMessage());
    }

    @Test
    void inviteMember_shouldThrowException_whenRequesterIsNotOwner() {
        User requester = new User("Test", null, "Member", "member@example.com", "hashed");
        Household household = new Household("Test Household");
        HouseholdMember membership = new HouseholdMember(household, requester, HouseholdRole.MEMBER);

        InviteMemberRequest request = new InviteMemberRequest();
        request.setEmail("someone@example.com");

        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(requester));
        when(householdMemberRepository.findByUser(requester)).thenReturn(Optional.of(membership));

        HouseholdException exception = assertThrows(HouseholdException.class,
                () -> householdService.inviteMember("member@example.com", request));

        assertEquals("Only the household owner can invite members.", exception.getMessage());
    }

    @Test
    void removeMember_shouldThrowException_whenTryingToRemoveTheOwner() {
        User owner = new User("Test", null, "Owner", "owner@example.com", "hashed");
        Household household = new Household("Test Household");
        HouseholdMember ownerMembership = new HouseholdMember(household, owner, HouseholdRole.OWNER);

        User targetOwner = new User("Test", null, "Owner", "owner@example.com", "hashed");
        targetOwner.setId(1L);
        HouseholdMember targetMembership = new HouseholdMember(household, targetOwner, HouseholdRole.OWNER);

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(householdMemberRepository.findByUser(owner)).thenReturn(Optional.of(ownerMembership));
        when(householdMemberRepository.findByHouseholdAndUser_Id(household, 1L))
                .thenReturn(Optional.of(targetMembership));

        HouseholdException exception = assertThrows(HouseholdException.class,
                () -> householdService.removeMember("owner@example.com", 1L));

        assertEquals("The household owner cannot be removed.", exception.getMessage());
    }
}