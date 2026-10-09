package com.trovexis.complytrack.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return authService.register(request); }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }
}

record RegisterRequest(@NotBlank @Size(max=120) String fullName,
                       @NotBlank @Email @Size(max=320) String email,
                       @NotBlank @Size(min=8, max=72) String password) {}
record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
record AuthResponse(String token, String email, String fullName) {}
