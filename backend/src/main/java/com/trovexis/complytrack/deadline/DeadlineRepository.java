package com.trovexis.complytrack.deadline;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeadlineRepository extends JpaRepository<Deadline, UUID> {
    List<Deadline> findAllByOwnerEmailOrderByDueDateAsc(String ownerEmail);
    Optional<Deadline> findByIdAndOwnerEmail(UUID id, String ownerEmail);
    boolean existsByBusinessIdAndRuleIdAndOwnerEmail(UUID businessId, UUID ruleId, String ownerEmail);
}
