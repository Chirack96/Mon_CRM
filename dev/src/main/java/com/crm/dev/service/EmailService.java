package com.crm.dev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String code) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Votre code de vérification");

            String verificationMessage = "<div style='font-family: Arial, sans-serif; line-height: 1.6;'>"
                    + "<h2>Bonjour,</h2>"
                    + "<p>Merci de vous être connecté à notre application. Pour finaliser votre connexion, veuillez utiliser le code de vérification suivant :</p>"
                    + "<h3 style='color: #2e6c80;'>" + code + "</h3>"
                    + "<p>Ce code est valable pendant 15 minutes. Si vous n'avez pas initié cette demande, veuillez ignorer cet email.</p>"
                    + "<p>Merci,</p>"
                    + "<p><strong>L'équipe de My Customize CRM</strong></p>"
                    + "<hr>"
                    + "<img src='cid:companyLogo' style='width: 150px; display: block; margin-top: 20px;'>"
                    + "</div>";

            helper.setText(verificationMessage, true);

            // ClassPathResource pour charger l'image du chemin de classe
            ClassPathResource resource = new ClassPathResource("images/NewBuy_resized_logo.png");
            helper.addInline("companyLogo", resource);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
