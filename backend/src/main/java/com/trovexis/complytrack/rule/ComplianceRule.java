package com.trovexis.complytrack.rule;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="compliance_rules")
public class ComplianceRule {
    @Id private UUID id;
    @Column(nullable=false, length=160) private String name;
    @Column(name="filing_type", nullable=false, length=80) private String filingType;
    @Column(nullable=false, length=30) private String frequency;
    @Column(nullable=false, length=80) private String jurisdiction;
    @Column(name="day_of_month") private Integer dayOfMonth;
    @Column(name="next_due_date", nullable=false) private LocalDate nextDueDate;
    @Column(name="active", nullable=false) private boolean active;
    @Column(name="created_at", nullable=false) private Instant createdAt;
    protected ComplianceRule() {}
    public ComplianceRule(String name, String filingType, String frequency, String jurisdiction, Integer dayOfMonth, LocalDate nextDueDate) {
        this.id=UUID.randomUUID(); this.name=name; this.filingType=filingType; this.frequency=frequency;
        this.jurisdiction=jurisdiction; this.dayOfMonth=dayOfMonth; this.nextDueDate=nextDueDate;
        this.active=true; this.createdAt=Instant.now();
    }
    public UUID getId(){return id;} public String getName(){return name;} public String getFilingType(){return filingType;}
    public String getFrequency(){return frequency;} public String getJurisdiction(){return jurisdiction;}
    public Integer getDayOfMonth(){return dayOfMonth;} public LocalDate getNextDueDate(){return nextDueDate;}
    public boolean isActive(){return active;}
}
