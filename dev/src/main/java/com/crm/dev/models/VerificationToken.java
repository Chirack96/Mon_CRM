package com.crm.dev.models;

import jakarta.persistence.*;
import java.util.Date;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "verification_tokens")
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Date expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("user-verificationTokens")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Liaison avec l'utilisateur

}
