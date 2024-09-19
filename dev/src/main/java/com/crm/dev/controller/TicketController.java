package com.crm.dev.controller;


import com.crm.dev.models.Ticket;
import com.crm.dev.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")

    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ticket != null ? ResponseEntity.ok(ticket) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        ticket.setId(id);
        return ResponseEntity.ok(ticketService.updateTicket(ticket));
    }

    @DeleteMapping("/{id}")

    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }

    @GetMapping("/assignee/{assignee}")
    public ResponseEntity<List<Ticket>> getTicketsByAssignee(@PathVariable String assignee) {
        return ResponseEntity.ok(ticketService.getTicketsByAssignee(assignee));
    }
}

