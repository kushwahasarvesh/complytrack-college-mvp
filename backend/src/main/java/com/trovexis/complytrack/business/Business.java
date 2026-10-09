package com.trovexis.complytrack.business;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "businesses")
public class Business {
    @Id private UUID id;
    @Column(name="owner_email", nullable=false, length=320) private String ownerEmail;
    @Column(nullable=false, length=160) private String name;
    @Column(name="business_type", nullable=false, length=80) private String businessType;
    @Column(nullable=false, length=80) private String state;
    @Column(name="registration_number", length=100) private String registrationNumber;
    @Column(name="created_at", nullable=false) private Instant createdAt;
    protected Business() {}
    public Business(String ownerEmail, String name, String businessType, String state, String registrationNumber) {
        this.id=UUID.randomUUID(); this.ownerEmail=ownerEmail; this.name=name; this.businessType=businessType;
        this.state=state; this.registrationNumber=registrationNumber; this.createdAt=Instant.now();
    }
    public UUID getId(){return id;} public String getOwnerEmail(){return ownerEmail;}
    public String getName(){return name;} public String getBusinessType(){return businessType;}
    public String getState(){return state;} public String getRegistrationNumber(){return registrationNumber;}
}
