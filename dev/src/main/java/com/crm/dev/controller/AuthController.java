package com.crm.dev.controller;

import com.crm.dev.models.User;
import com.crm.dev.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User authenticatedUser = authService.authenticate(user.getEmail(), user.getPassword());
        if (authenticatedUser != null) {
            return ResponseEntity.ok(authenticatedUser);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        if (registeredUser != null) {
            return ResponseEntity.ok(registeredUser);
        } else {
            return ResponseEntity.status(400).body("User already exists");
        }
    }
}
