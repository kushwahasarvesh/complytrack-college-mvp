package com.trovexis.complytrack.rule;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/rules")
public class RuleController {
    private final ComplianceRuleRepository repository;
    public RuleController(ComplianceRuleRepository repository) { this.repository=repository; }
    @GetMapping public List<ComplianceRule> list() { return repository.findAllByActiveTrueOrderByNameAsc(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ComplianceRule create(@Valid @RequestBody RuleRequest r) {
        String frequency = r.frequency().trim().toUpperCase();
        if (!Set.of("MONTHLY", "QUARTERLY", "YEARLY").contains(frequency)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Frequency must be MONTHLY, QUARTERLY, or YEARLY");
        }
        return repository.save(new ComplianceRule(r.name().trim(), r.filingType().trim(), frequency,
                r.jurisdiction().trim(), r.dayOfMonth(), r.nextDueDate()));
    }
}
record RuleRequest(@NotBlank @Size(max=160) String name, @NotBlank @Size(max=80) String filingType,
                   @NotBlank String frequency, @NotBlank @Size(max=80) String jurisdiction,
                   @Min(1) @Max(31) Integer dayOfMonth, @NotNull LocalDate nextDueDate) {}
