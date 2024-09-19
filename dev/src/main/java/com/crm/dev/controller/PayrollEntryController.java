package com.crm.dev.controller;

import com.crm.dev.models.PayrollEntry;
import com.crm.dev.models.User;
import com.crm.dev.service.PayrollEntryService;
import com.crm.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payroll-entries")
public class PayrollEntryController {

    @Autowired
    private PayrollEntryService payrollEntryService;

    @Autowired
    private UserService userService;  // Service pour gérer les utilisateurs

    // Endpoint pour obtenir toutes les entrées de paie
    @GetMapping
    public ResponseEntity<List<PayrollEntry>> getAllPayrollEntries() {
        List<PayrollEntry> payrollEntries = payrollEntryService.findAllPayrollEntries();
        return new ResponseEntity<>(payrollEntries, HttpStatus.OK);
    }

    // Endpoint pour créer une nouvelle entrée de paie
    @PostMapping
    public ResponseEntity<?> createPayrollEntry(@RequestBody Map<String, Object> payload) {
        Long userId = payload.containsKey("userId") ? Long.parseLong(payload.get("userId").toString()) : null;
        Double amount = payload.containsKey("amount") ? Double.parseDouble(payload.get("amount").toString()) : null;
        String paymentDateStr = payload.containsKey("paymentDate") ? payload.get("paymentDate").toString() : null;

        if (userId == null || amount == null || amount <= 0 || paymentDateStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Les informations fournies sont incorrectes."));
        }

        LocalDate paymentDate;
        try {
            paymentDate = LocalDate.parse(paymentDateStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le format de la date est incorrect."));
        }

        Optional<User> userOptional = Optional.ofNullable(userService.getUserById(userId));
        if (userOptional.isPresent()) {
            PayrollEntry payrollEntry = PayrollEntry.builder()
                    .user(userOptional.get())
                    .amount(amount)
                    .paymentDate(paymentDate)
                    .build();

            PayrollEntry createdEntry = payrollEntryService.createPayrollEntry(payrollEntry).getBody();
            return new ResponseEntity<>(createdEntry, HttpStatus.CREATED);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Utilisateur non trouvé."));
        }
    }
// Endpoint pour mettre à jour une entrée de paie par son ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayrollEntry(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<PayrollEntry> payrollEntryOptional = payrollEntryService.getPayrollEntryById(id);
        if (payrollEntryOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Long userId = payload.containsKey("userId") ? Long.parseLong(payload.get("userId").toString()) : null;
        Double amount = payload.containsKey("amount") ? Double.parseDouble(payload.get("amount").toString()) : null;
        String paymentDateStr = payload.containsKey("paymentDate") ? payload.get("paymentDate").toString() : null;

        if (userId == null || amount == null || amount <= 0 || paymentDateStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Les informations fournies sont incorrectes."));
        }

        LocalDate paymentDate;
        try {
            paymentDate = LocalDate.parse(paymentDateStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le format de la date est incorrect."));
        }

        Optional<User> userOptional = Optional.ofNullable(userService.getUserById(userId));
        if (userOptional.isPresent()) {
            PayrollEntry payrollEntry = PayrollEntry.builder()
                    .id(id)
                    .user(userOptional.get())
                    .amount(amount)
                    .paymentDate(paymentDate)
                    .build();

            PayrollEntry updatedEntry = payrollEntryService.updatePayrollEntry(id, payrollEntry).getBody();
            return new ResponseEntity<>(updatedEntry, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Utilisateur non trouvé."));
        }
    }


    // Endpoint pour supprimer une entrée de paie par son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayrollEntry(@PathVariable Long id) {
        ResponseEntity<HttpStatus> response = payrollEntryService.deletePayrollEntry(id);
        return new ResponseEntity<>(response.getStatusCode());
    }

    // Endpoint pour obtenir une entrée de paie par son ID
    @GetMapping("/{id}")
    public ResponseEntity<PayrollEntry> getPayrollEntryById(@PathVariable Long id) {
        Optional<PayrollEntry> payrollEntry = payrollEntryService.getPayrollEntryById(id);
        return payrollEntry
                .map(entry -> new ResponseEntity<>(entry, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint pour obtenir les entrées de paie par l'ID utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PayrollEntry>> getPayrollEntriesByUserId(@PathVariable Long userId) {
        List<PayrollEntry> payrollEntries = payrollEntryService.findPayrollEntriesByUserId(userId);
        return new ResponseEntity<>(payrollEntries, HttpStatus.OK);
    }
}