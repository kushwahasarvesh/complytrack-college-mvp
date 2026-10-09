package com.trovexis.complytrack.deadline;

import com.trovexis.complytrack.business.Business;
import com.trovexis.complytrack.business.BusinessRepository;
import com.trovexis.complytrack.rule.ComplianceRule;
import com.trovexis.complytrack.rule.ComplianceRuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeadlineServiceTest {
    @Mock DeadlineRepository deadlines;
    @Mock BusinessRepository businesses;
    @Mock ComplianceRuleRepository rules;
    DeadlineService service;

    @BeforeEach void setUp() { service = new DeadlineService(deadlines, businesses, rules); }

    @Test void generateCreatesDeadlineForBusinessOwnedByCaller() {
        String owner = "student@example.com";
        UUID businessId = UUID.randomUUID();
        UUID ruleId = UUID.randomUUID();
        Business business = new Business(owner, "Demo Shop", "Retail", "Delhi", null);
        ComplianceRule rule = new ComplianceRule("GST Demo", "GST", "MONTHLY", "India (demo)", 20, LocalDate.now().plusDays(10));
        when(businesses.findByIdAndOwnerEmail(businessId, owner)).thenReturn(Optional.of(business));
        when(rules.findById(ruleId)).thenReturn(Optional.of(rule));
        when(deadlines.save(any(Deadline.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Deadline result = service.generate(owner, businessId, ruleId);

        assertEquals(owner, result.getOwnerEmail());
        assertEquals(business.getId(), result.getBusinessId());
        assertEquals(rule.getId(), result.getRuleId());
        verify(deadlines).save(any(Deadline.class));
    }

    @Test void generateRejectsBusinessNotOwnedByCaller() {
        UUID businessId = UUID.randomUUID();
        when(businesses.findByIdAndOwnerEmail(businessId, "other@example.com")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class,
                () -> service.generate("other@example.com", businessId, UUID.randomUUID()));
        verifyNoInteractions(rules);
        verify(deadlines, never()).save(any());
    }

    @Test void completeChangesStatusToCompleted() {
        String owner = "student@example.com";
        UUID id = UUID.randomUUID();
        Deadline deadline = new Deadline(UUID.randomUUID(), UUID.randomUUID(), owner, "GST Demo", LocalDate.now().plusDays(1));
        when(deadlines.findByIdAndOwnerEmail(id, owner)).thenReturn(Optional.of(deadline));
        when(deadlines.save(deadline)).thenReturn(deadline);

        Deadline result = service.complete(owner, id);

        assertEquals("COMPLETED", result.getStatus());
        assertNotNull(result.getCompletedAt());
    }

    @Test void openDeadlineStatusFollowsDueDate() {
        Deadline overdue = new Deadline(UUID.randomUUID(), UUID.randomUUID(), "student@example.com", "Old", LocalDate.now().minusDays(1));
        Deadline soon = new Deadline(UUID.randomUUID(), UUID.randomUUID(), "student@example.com", "Soon", LocalDate.now().plusDays(2));
        Deadline later = new Deadline(UUID.randomUUID(), UUID.randomUUID(), "student@example.com", "Later", LocalDate.now().plusDays(30));
        assertEquals("OVERDUE", overdue.getStatus());
        assertEquals("DUE_SOON", soon.getStatus());
        assertEquals("UPCOMING", later.getStatus());
    }
}
