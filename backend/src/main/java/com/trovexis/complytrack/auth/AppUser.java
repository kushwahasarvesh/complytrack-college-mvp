package com.trovexis.complytrack.auth;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class AppUser {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 320) private String email;
    @Column(name = "full_name", nullable = false, length = 120) private String fullName;
    @Column(name = "password_hash", nullable = false, length = 100) private String passwordHash;
    @Column(nullable = false, length = 30) private String role = "USER";
    @Column(name = "created_at", nullable = false) private Instant createdAt;

    protected AppUser() {}
    public AppUser(String email, String fullName, String passwordHash) {
        this.id = UUID.randomUUID(); this.email = email; this.fullName = fullName;
        this.passwordHash = passwordHash; this.role = "USER"; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
}
