package com.trovexis.complytrack.rule;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ComplianceRuleRepository extends JpaRepository<ComplianceRule, UUID> {
    List<ComplianceRule> findAllByActiveTrueOrderByNameAsc();
}
