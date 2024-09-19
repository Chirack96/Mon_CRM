package com.crm.dev.repository;

import com.crm.dev.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByAssignee(String assignee);
}
