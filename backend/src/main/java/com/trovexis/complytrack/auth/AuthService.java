package com.trovexis.complytrack.auth;

import com.trovexis.complytrack.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        AppUser user = users.save(new AppUser(email, request.fullName().trim(), encoder.encode(request.password())));
        return new AuthResponse(jwt.generate(user.getEmail(), user.getRole()), user.getEmail(), user.getFullName());
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(request.password(), user.getPasswordHash()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return new AuthResponse(jwt.generate(user.getEmail(), user.getRole()), user.getEmail(), user.getFullName());
    }
}
