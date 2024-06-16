package com.crm.dev.service;

import com.crm.dev.models.User;
import com.crm.dev.models.VerificationToken;
import com.crm.dev.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationCodeService {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    public String createVerificationCode(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(new Date(System.currentTimeMillis() + (30 * 60 * 1000))); // Token expires in 30 minutes
        verificationTokenRepository.save(verificationToken);
        return token;
    }

    public boolean validateVerificationToken(Long userId, String token) {
        Optional<VerificationToken> verificationTokenOpt = verificationTokenRepository.findByUserIdAndToken(userId, token);
        if (!verificationTokenOpt.isPresent()) {
            return false; // Le token n'existe pas
        }
        VerificationToken verificationToken = verificationTokenOpt.get();
        return verificationToken.getExpiryDate().after(new Date()); // Vérifie si le token n'a pas expiré
    }
}
