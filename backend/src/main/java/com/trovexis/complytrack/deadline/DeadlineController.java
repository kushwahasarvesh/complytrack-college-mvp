package com.trovexis.complytrack.deadline;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/deadlines")
public class DeadlineController {
    private final DeadlineService service;
    public DeadlineController(DeadlineService service) { this.service=service; }
    @GetMapping public List<Deadline> list(Authentication auth) { return service.list(auth.getName()); }
    @PostMapping("/generate") @ResponseStatus(HttpStatus.CREATED)
    public Deadline generate(Authentication auth, @RequestParam UUID businessId, @RequestParam UUID ruleId) {
        return service.generate(auth.getName(), businessId, ruleId);
    }
    @PostMapping("/samples")
    public List<Deadline> samples(Authentication auth, @RequestParam UUID businessId) {
        return service.addSamples(auth.getName(), businessId);
    }
    @PatchMapping("/{id}/complete")
    public Deadline complete(Authentication auth, @PathVariable UUID id) { return service.complete(auth.getName(), id); }
}
