package com.crm.dev.service;

import com.crm.dev.models.PayrollEntry;
import com.crm.dev.models.User;
import com.crm.dev.repository.PayrollEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PayrollEntryService {

    @Autowired
    private PayrollEntryRepository payrollEntryRepository;

    @Autowired
    private UserService userService;

    public List<PayrollEntry> findAllPayrollEntries() {
        return payrollEntryRepository.findAll();
    }

    public Optional<PayrollEntry> getPayrollEntryById(Long id) {
        return payrollEntryRepository.findById(id);
    }


    public List<PayrollEntry> findPayrollEntriesByUserId(Long userId) {
        return payrollEntryRepository.findByUser_Id(userId);
    }

    public ResponseEntity<PayrollEntry> createPayrollEntry(PayrollEntry payrollEntry) {
        // Récupérer l'utilisateur en tant qu'Optional
        Optional<User> userOptional = Optional.ofNullable(userService.getUserById(payrollEntry.getUserId()));

        // Vérifier si l'utilisateur existe
        if (userOptional.isPresent()) {
            payrollEntry.setUser(userOptional.get());
            PayrollEntry savedEntry = payrollEntryRepository.save(payrollEntry);
            return new ResponseEntity<>(savedEntry, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<PayrollEntry> updatePayrollEntry(Long id, PayrollEntry payrollEntry) {
        if (!payrollEntryRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Récupérer l'utilisateur en tant qu'Optional
        Optional<User> userOptional = Optional.ofNullable(userService.getUserById(payrollEntry.getUserId()));

        // Vérifier si l'utilisateur existe
        if (userOptional.isPresent()) {
            payrollEntry.setUser(userOptional.get());
            payrollEntry.setId(id);
            PayrollEntry updatedEntry = payrollEntryRepository.save(payrollEntry);
            return new ResponseEntity<>(updatedEntry, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<HttpStatus> deletePayrollEntry(Long id) {
        if (!payrollEntryRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        payrollEntryRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
