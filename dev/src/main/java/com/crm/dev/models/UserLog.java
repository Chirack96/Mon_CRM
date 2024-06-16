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
@Table(name = "user_logs")
public class UserLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user; // Relie UserLog à User

    @Column(nullable = true)
    private String email;  // Mettre cette ligne si des cas où l'email n'est pas lié à un user existent

    @Column(nullable = false)
    private String details;

    @Column(nullable = false)
    private Date loginTime;
}
