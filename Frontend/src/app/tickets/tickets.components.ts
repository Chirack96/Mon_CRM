import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  newTicket: Ticket = { id: 0, title: '', description: '', status: 'Open', createdDate: '', updatedDate: '' };
  showAddTicketForm: boolean = false;

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.fetchTickets().then(r => r);
  }

  async fetchTickets() {
    try {
      this.tickets = await this.ticketService.getAllTickets();
    } catch (error) {
      console.error('Error fetching tickets', error);
    }
  }

  async createTicket() {
    try {
      this.newTicket.createdDate = new Date().toISOString();
      this.newTicket.updatedDate = this.newTicket.createdDate;
      const createdTicket = await this.ticketService.createTicket(this.newTicket);
      this.tickets.push(createdTicket);
      this.newTicket = { id: 0, title: '', description: '', status: 'Open', createdDate: '', updatedDate: '' }; // Réinitialiser le formulaire
      this.showAddTicketForm = false; // Masquer le formulaire après la création du ticket
    } catch (error) {
      console.error('Error creating ticket', error);
    }
  }

  async updateTicket(ticket: Ticket) {
    try {
      ticket.updatedDate = new Date().toISOString();
      await this.ticketService.updateTicket(ticket);
    } catch (error) {
      console.error('Error updating ticket', error);
    }
  }

  async deleteTicket(id: number) {
    try {
      await this.ticketService.deleteTicket(id);
      this.tickets = this.tickets.filter(ticket => ticket.id !== id);
    } catch (error) {
      console.error('Error deleting ticket', error);
    }
  }
}
