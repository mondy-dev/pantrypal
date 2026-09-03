package com.pantrypal.backend.service;

import com.pantrypal.backend.dto.CreateHouseholdRequest;
import com.pantrypal.backend.dto.HouseholdResponse;
import com.pantrypal.backend.dto.InviteMemberRequest;
import com.pantrypal.backend.dto.MemberResponse;
import com.pantrypal.backend.exception.HouseholdException;
import com.pantrypal.backend.model.Household;
import com.pantrypal.backend.model.HouseholdMember;
import com.pantrypal.backend.model.HouseholdRole;
import com.pantrypal.backend.model.User;
import com.pantrypal.backend.repository.HouseholdMemberRepository;
import com.pantrypal.backend.repository.HouseholdRepository;
import com.pantrypal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    public HouseholdService(HouseholdRepository householdRepository,
            HouseholdMemberRepository householdMemberRepository,
            UserRepository userRepository) {
        this.householdRepository = householdRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.userRepository = userRepository;
    }

    public HouseholdResponse createHousehold(String requesterEmail, CreateHouseholdRequest request) {
        User user = getUserByEmail(requesterEmail);

        if (householdMemberRepository.existsByUser(user)) {
            throw new HouseholdException("You already belong to a household.");
        }

        Household household = new Household(request.getName());
        householdRepository.save(household);

        HouseholdMember membership = new HouseholdMember(household, user, HouseholdRole.OWNER);
        householdMemberRepository.save(membership);

        return buildResponse(household);
    }

    public HouseholdResponse getMyHousehold(String requesterEmail) {
        User user = getUserByEmail(requesterEmail);

        HouseholdMember membership = householdMemberRepository.findByUser(user)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        return buildResponse(membership.getHousehold());
    }

    public HouseholdResponse inviteMember(String requesterEmail, InviteMemberRequest request) {
        User requester = getUserByEmail(requesterEmail);

        HouseholdMember requesterMembership = householdMemberRepository.findByUser(requester)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        if (requesterMembership.getRole() != HouseholdRole.OWNER) {
            throw new HouseholdException("Only the household owner can invite members.");
        }

        User invitee = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new HouseholdException("No account found with that email."));

        if (householdMemberRepository.existsByUser(invitee)) {
            throw new HouseholdException("This user already belongs to a household.");
        }

        Household household = requesterMembership.getHousehold();
        HouseholdMember newMembership = new HouseholdMember(household, invitee, HouseholdRole.MEMBER);
        householdMemberRepository.save(newMembership);

        return buildResponse(household);
    }

    public HouseholdResponse removeMember(String requesterEmail, Long targetUserId) {
        User requester = getUserByEmail(requesterEmail);

        HouseholdMember requesterMembership = householdMemberRepository.findByUser(requester)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        if (requesterMembership.getRole() != HouseholdRole.OWNER) {
            throw new HouseholdException("Only the household owner can remove members.");
        }

        Household household = requesterMembership.getHousehold();

        HouseholdMember targetMembership = householdMemberRepository.findByHouseholdAndUser_Id(household, targetUserId)
                .orElseThrow(() -> new HouseholdException("That user is not a member of this household."));

        if (targetMembership.getRole() == HouseholdRole.OWNER) {
            throw new HouseholdException("The household owner cannot be removed.");
        }

        householdMemberRepository.delete(targetMembership);

        return buildResponse(household);
    }

    public HouseholdResponse renameHousehold(String requesterEmail, CreateHouseholdRequest request) {
        User requester = getUserByEmail(requesterEmail);

        HouseholdMember requesterMembership = householdMemberRepository.findByUser(requester)
                .orElseThrow(() -> new HouseholdException("You don't belong to a household yet."));

        if (requesterMembership.getRole() != HouseholdRole.OWNER) {
            throw new HouseholdException("Only the household owner can rename the household.");
        }

        Household household = requesterMembership.getHousehold();
        household.setName(request.getName());
        householdRepository.save(household);

        return buildResponse(household);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new HouseholdException("User not found."));
    }

    private HouseholdResponse buildResponse(Household household) {
        List<MemberResponse> members = householdMemberRepository.findByHousehold(household).stream()
                .map(m -> new MemberResponse(
                        m.getUser().getId(),
                        m.getUser().getFirstName(),
                        m.getUser().getLastName(),
                        m.getUser().getEmail(),
                        m.getRole().name()))
                .toList();

        return new HouseholdResponse(household.getId(), household.getName(), members);
    }
}