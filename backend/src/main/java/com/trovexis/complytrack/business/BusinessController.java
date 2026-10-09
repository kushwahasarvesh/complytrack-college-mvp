package com.trovexis.complytrack.business;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/businesses")
public class BusinessController {
    private final BusinessRepository repository;
    public BusinessController(BusinessRepository repository) { this.repository = repository; }

    @GetMapping public List<Business> list(Authentication auth) {
        return repository.findAllByOwnerEmailOrderByCreatedAtDesc(auth.getName());
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Business create(Authentication auth, @Valid @RequestBody BusinessRequest request) {
        return repository.save(new Business(auth.getName(), request.name().trim(), request.businessType().trim(),
                request.state().trim(), request.registrationNumber()));
    }

    @GetMapping("/{id}") public Business get(Authentication auth, @PathVariable UUID id) {
        return repository.findByIdAndOwnerEmail(id, auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found"));
    }
}
record BusinessRequest(@NotBlank @Size(max=160) String name, @NotBlank @Size(max=80) String businessType,
                       @NotBlank @Size(max=80) String state, @Size(max=100) String registrationNumber) {}
