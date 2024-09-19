package com.crm.dev.models;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String priority;

    private String type;

    private String resolution;

    @Column(nullable = false)
    private String assignee;

    @Column(nullable = false)
    private String reporter;

    @Column(nullable = false)
    private LocalDate createdDate;

    private LocalDate updatedDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate closedDate;

    private String comments;
}