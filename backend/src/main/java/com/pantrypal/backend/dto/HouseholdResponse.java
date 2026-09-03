package com.pantrypal.backend.dto;

import java.util.List;

public class HouseholdResponse {

    private Long householdId;
    private String name;
    private List<MemberResponse> members;

    public HouseholdResponse(Long householdId, String name, List<MemberResponse> members) {
        this.householdId = householdId;
        this.name = name;
        this.members = members;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public String getName() {
        return name;
    }

    public List<MemberResponse> getMembers() {
        return members;
    }
}