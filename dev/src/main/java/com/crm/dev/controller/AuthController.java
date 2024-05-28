package com.crm.dev.controller;

import com.crm.dev.dto.AuthentificationDTO;
import com.crm.dev.dto.RegisterDTO;
import com.crm.dev.models.User;
import com.crm.dev.repository.UserRepository;
import com.crm.dev.config.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        Optional<User> existingUser = userRepository.findByEmail(registerDTO.email());
        if (existingUser.isPresent()) {
            log.warn("User registration failed for email: {}", registerDTO.email());
            return ResponseEntity.status(400).body("User already exists");
        }

        User newUser = new User();
        newUser.setEmail(registerDTO.email());
        newUser.setPassword(passwordEncoder.encode(registerDTO.password()));
        newUser.setFirstname(registerDTO.firstname());
        newUser.setLastname(registerDTO.lastname());
        newUser.setGroupe(registerDTO.groupe() != null ? registerDTO.groupe() : "");
        User registeredUser = userRepository.save(newUser);

        log.info("User registered successfully with email: {}", registerDTO.email());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthentificationDTO authentificationDTO) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authentificationDTO.email(), authentificationDTO.password())
            );

            if (authenticate.isAuthenticated()) {
                // Récupérer l'objet UserDetails
                org.springframework.security.core.userdetails.User userDetails =
                        (org.springframework.security.core.userdetails.User) authenticate.getPrincipal();
                // Générer le token JWT
                Map<String, Object> token = this.jwtService.generate(userDetails.getUsername());
                return ResponseEntity.ok(token);
            } else {
                log.warn("Authentication failed for user: {}", authentificationDTO.email());
                return ResponseEntity.status(401).body("Authentication failed");
            }
        } catch (Exception e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401).body("Authentication error");
        }
    }
}
