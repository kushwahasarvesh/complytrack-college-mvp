package com.trovexis.complytrack.deadline;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="deadlines")
public class Deadline {
    @Id private UUID id;
    @Column(name="business_id", nullable=false) private UUID businessId;
    @Column(name="rule_id", nullable=false) private UUID ruleId;
    @Column(name="owner_email", nullable=false, length=320) private String ownerEmail;
    @Column(name="title", nullable=false, length=160) private String title;
    @Column(name="due_date", nullable=false) private LocalDate dueDate;
    @Column(nullable=false, length=30) private String status;
    @Column(name="completed_at") private Instant completedAt;
    @Column(name="created_at", nullable=false) private Instant createdAt;
    protected Deadline() {}
    public Deadline(UUID businessId, UUID ruleId, String ownerEmail, String title, LocalDate dueDate) {
        this.id=UUID.randomUUID(); this.businessId=businessId; this.ruleId=ruleId; this.ownerEmail=ownerEmail;
        this.title=title; this.dueDate=dueDate; this.status="UPCOMING"; this.createdAt=Instant.now();
    }
    public void complete(){this.status="COMPLETED";this.completedAt=Instant.now();}
    public UUID getId(){return id;} public UUID getBusinessId(){return businessId;} public UUID getRuleId(){return ruleId;}
    public String getOwnerEmail(){return ownerEmail;} public String getTitle(){return title;}
    public LocalDate getDueDate(){return dueDate;}
    public String getStatus() {
        if ("COMPLETED".equals(status) || dueDate == null) return status;
        LocalDate today = LocalDate.now();
        if (dueDate.isBefore(today)) return "OVERDUE";
        if (!dueDate.isAfter(today.plusDays(7))) return "DUE_SOON";
        return "UPCOMING";
    }
    public Instant getCompletedAt(){return completedAt;}
}
