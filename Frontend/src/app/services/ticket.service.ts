import { Injectable } from '@angular/core';
import axios from 'axios';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/api/tickets';

  constructor() { }

  async getAllTickets(): Promise<Ticket[]> {
    const response = await axios.get<Ticket[]>(this.baseUrl);
    return response.data;
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    const response = await axios.post<Ticket>(this.baseUrl, ticket);
    return response.data;
  }

  async updateTicket(ticket: Ticket): Promise<Ticket> {
    const response = await axios.put<Ticket>(`${this.baseUrl}/${ticket.id}`, ticket);
    return response.data;
  }

  async deleteTicket(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
