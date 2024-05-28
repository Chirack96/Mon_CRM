package com.crm.dev.controller;

import com.crm.dev.dto.AuthentificationDTO;
import com.crm.dev.models.User;
import com.crm.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;  // Ensure this is autowired

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.saveUser(user);
        return ResponseEntity.ok(createdUser);
    }
    @DeleteMapping("/delete/range")
    public ResponseEntity<Void> deleteUsersInRange(
            @RequestParam("startId") Long startId,
            @RequestParam("endId") Long endId) {
        userService.deleteUsersByIdRange(startId, endId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create-multiple")
    public ResponseEntity<List<User>> createMultipleUsers(@RequestParam int count) {
        List<User> users = userService.createMultipleUsers(count);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/groupe/{groupe}")
    public ResponseEntity<User> getUserByGroupe(@PathVariable String groupe) {
        User user = userService.getUserByGroupe(groupe);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
