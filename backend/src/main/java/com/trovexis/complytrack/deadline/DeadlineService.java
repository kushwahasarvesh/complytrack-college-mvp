package com.trovexis.complytrack.deadline;

import com.trovexis.complytrack.business.BusinessRepository;
import com.trovexis.complytrack.rule.ComplianceRule;
import com.trovexis.complytrack.rule.ComplianceRuleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DeadlineService {
    private final DeadlineRepository deadlines;
    private final BusinessRepository businesses;
    private final ComplianceRuleRepository rules;
    public DeadlineService(DeadlineRepository deadlines, BusinessRepository businesses, ComplianceRuleRepository rules) {
        this.deadlines=deadlines; this.businesses=businesses; this.rules=rules;
    }
    public static final UUID OVERDUE_SAMPLE_RULE = UUID.fromString("10000000-0000-0000-0000-000000000004");
    public static final UUID DUE_SOON_SAMPLE_RULE = UUID.fromString("10000000-0000-0000-0000-000000000005");

    public List<Deadline> list(String owner) { return deadlines.findAllByOwnerEmailOrderByDueDateAsc(owner); }

    @Transactional
    public List<Deadline> addSamples(String owner, UUID businessId) {
        List<Deadline> created = new ArrayList<>();
        for (UUID ruleId : List.of(OVERDUE_SAMPLE_RULE, DUE_SOON_SAMPLE_RULE)) {
            if (deadlines.existsByBusinessIdAndRuleIdAndOwnerEmail(businessId, ruleId, owner)) continue;
            created.add(generate(owner, businessId, ruleId));
        }
        return created;
    }

    @Transactional
    public Deadline generate(String owner, UUID businessId, UUID ruleId) {
        var business=businesses.findByIdAndOwnerEmail(businessId, owner)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found"));
        ComplianceRule rule=rules.findById(ruleId)
                .filter(ComplianceRule::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active rule not found"));
        return deadlines.save(new Deadline(business.getId(), rule.getId(), owner, rule.getName(), rule.getNextDueDate()));
    }

    @Transactional
    public Deadline complete(String owner, UUID id) {
        Deadline d=deadlines.findByIdAndOwnerEmail(id, owner)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deadline not found"));
        d.complete();
        return deadlines.save(d);
    }
}
