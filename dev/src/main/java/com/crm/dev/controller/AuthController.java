package com.crm.dev.controller;

import com.crm.dev.config.JwtService;
import com.crm.dev.dto.AuthentificationDTO;
import com.crm.dev.dto.RegisterDTO;
import com.crm.dev.models.User;
import com.crm.dev.service.EmailService;
import com.crm.dev.service.UserLogService;
import com.crm.dev.service.VerificationCodeService;
import com.crm.dev.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserLogService userLogService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        Optional<User> existingUser = userRepository.findByEmail(registerDTO.email());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(400).body("User already exists");
        }

        User newUser = new User();
        newUser.setEmail(registerDTO.email());
        newUser.setPassword(passwordEncoder.encode(registerDTO.password()));
        newUser.setFirstname(registerDTO.firstname());
        newUser.setLastname(registerDTO.lastname());
        newUser.setGroupe(registerDTO.groupe() != null ? registerDTO.groupe() : "");
        User registeredUser = userRepository.save(newUser);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthentificationDTO authentificationDTO) {
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authentificationDTO.email(), authentificationDTO.password())
            );

            if (authenticate.isAuthenticated()) {
                User user = userRepository.findByEmail(authentificationDTO.email())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + authentificationDTO.email()));

                // Générer un code de vérification
                String verificationCode = verificationCodeService.createVerificationCode(user);

                // Envoyer le code de vérification par e-mail
                emailService.sendVerificationEmail(user.getEmail(), verificationCode);

                // Retourner une réponse nécessitant le code de vérification
                return ResponseEntity.ok(Map.of("userId", user.getId(), "message", "Verification code sent. Please enter the code to complete login."));
            } else {
                userLogService.logUserLogin(null, authentificationDTO.email(), "Login failed due to incorrect credentials");
                return ResponseEntity.status(401).body("Authentication failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login error");
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        String code = payload.get("code");

        if (verificationCodeService.validateVerificationToken(userId, code)) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Map<String, Object> token = jwtService.generate(user.getEmail(), user.getId(), user.getAuthorities());

            // Enregistrer le succès de la connexion
            userLogService.logUserLogin(user.getId(), user.getEmail(), "Login successful");

            return ResponseEntity.ok(token);
        } else {
            userLogService.logUserLogin(userId, "", "Login failed due to invalid or expired verification code");
            return ResponseEntity.status(401).body("Invalid or expired verification code");
        }
    }
}
