package com.trovexis.complytrack.business;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BusinessRepository extends JpaRepository<Business, UUID> {
    List<Business> findAllByOwnerEmailOrderByCreatedAtDesc(String ownerEmail);
    Optional<Business> findByIdAndOwnerEmail(UUID id, String ownerEmail);
}
