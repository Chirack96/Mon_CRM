package com.crm.dev.controller;

import com.crm.dev.config.JwtService;
import com.crm.dev.dto.AuthentificationDTO;
import com.crm.dev.dto.RegisterDTO;
import com.crm.dev.models.User;
import com.crm.dev.service.EmailService;
import com.crm.dev.service.UserLogService;
import com.crm.dev.service.VerificationCodeService;
import com.crm.dev.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200,http://192.168.1.164:80,http://192.168.1.164")
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
            return ResponseEntity.status(409).body("User already exists");
        }

        User newUser = new User();
        newUser.setEmail(registerDTO.email());
        newUser.setPassword(passwordEncoder.encode(registerDTO.password()));
        newUser.setFirstname(registerDTO.firstname());
        newUser.setLastname(registerDTO.lastname());
        newUser.setGroupe(registerDTO.groupe() != null ? registerDTO.groupe() : "");
        newUser.setImage(registerDTO.image() != null ? registerDTO.image() : "");
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
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> payload, HttpServletResponse response) {
        Long userId = Long.parseLong(payload.get("userId"));
        String code = payload.get("code");

        if (verificationCodeService.validateVerificationToken(userId, code)) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Map<String, Object> token = jwtService.generate(user.getEmail(), user.getId(), user.getAuthorities());

            // Créer un cookie HttpOnly pour le token
            Cookie cookie = new Cookie("auth_token", (String) token.get("token"));
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Définit le cookie comme sécurisé
            cookie.setPath("/"); // Définit le chemin d'accès pour le cookie
            cookie.setMaxAge(30 * 60 * 24); // Expire après 30 minutes

            response.addCookie(cookie);

            // Ajouter les en-têtes CORS
            //response.setHeader("Access-Control-Allow-Origin", "http://192.168.1.164:80,http://192.168.1.164:80,http://localhost:4200");
            //response.setHeader("Access-Control-Allow-Credentials", "true");

            // Enregistrer le succès de la connexion
            userLogService.logUserLogin(user.getId(), user.getEmail(), "Login successful");

            return ResponseEntity.ok("Authenticated");
        } else {
            userLogService.logUserLogin(userId, "", "Login failed due to invalid or expired verification code");
            return ResponseEntity.status(401).body("Invalid or expired verification code");
        }
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, Object>> checkAuth(HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("auth_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        if (token != null && !jwtService.isTokenExpired(token)) {
            response.put("authenticated", true);
            response.put("verificationPending", false); // Update as necessary
        } else {
            response.put("authenticated", false);
            response.put("verificationPending", false);
        }
        return ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Change to true if using HTTPS in production
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        // Ajouter les en-têtes CORS dynamiquement
        String origin = request.getHeader("Origin");
        if (origin != null && (origin.equals("http://localhost:4200") || origin.equals("http://192.168.1.164:80"))) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }
        response.setHeader("Access-Control-Allow-Credentials", "true");

        return ResponseEntity.ok("Logged out");
    }

    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("auth_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null && !jwtService.isTokenExpired(token)) {
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

            // Supprimer les champs inutiles en définissant les champs non nécessaires à null
            user.setPassword(null);
            user.setRoles(null);
            user.setUserLogs(null);
            user.setVerificationTokens(null);

            // Créer une map avec les champs nécessaires
            Map<String, Object> userProfile = new HashMap<>();
            userProfile.put("firstname", user.getFirstname());
            userProfile.put("lastname", user.getLastname());
            userProfile.put("email", user.getEmail());
            userProfile.put("image", user.getImage());
            userProfile.put("groupe", user.getGroupe());
            userProfile.put("id", user.getId());

            return ResponseEntity.ok(userProfile);
        } else {
            System.out.println("Token is null, missing or expired.");
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @GetMapping("user-role")
    public ResponseEntity<?> getUserRole(HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("auth_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null && !jwtService.isTokenExpired(token)) {
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

            return ResponseEntity.ok(user.getRoles());
        } else {
            System.out.println("Token is null, missing or expired.");
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }


}

