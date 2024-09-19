package com.crm.dev.service;


import com.crm.dev.models.Ticket;
import com.crm.dev.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    public final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    public Ticket updateTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public List<Ticket> getTicketsByAssignee(String assignee) {
        return ticketRepository.findByAssignee(assignee);
    }
}
