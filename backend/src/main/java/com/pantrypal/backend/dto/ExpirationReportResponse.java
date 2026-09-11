package com.pantrypal.backend.dto;

public class ExpirationReportResponse {

    private long expiredCount;
    private long expiringThisWeekCount;
    private long expiringThisMonthCount;

    public ExpirationReportResponse(long expiredCount, long expiringThisWeekCount, long expiringThisMonthCount) {
        this.expiredCount = expiredCount;
        this.expiringThisWeekCount = expiringThisWeekCount;
        this.expiringThisMonthCount = expiringThisMonthCount;
    }

    public long getExpiredCount() {
        return expiredCount;
    }

    public long getExpiringThisWeekCount() {
        return expiringThisWeekCount;
    }

    public long getExpiringThisMonthCount() {
        return expiringThisMonthCount;
    }
}