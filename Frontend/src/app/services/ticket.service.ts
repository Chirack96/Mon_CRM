import { Injectable } from '@angular/core';
import axios from 'axios';
import { Ticket } from '../models/ticket.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = `${environment.apiUrl}/tickets`;

  constructor() { }

  async getTickets(): Promise<Ticket[]> {
    const response = await axios.get<Ticket[]>(this.baseUrl, {
      withCredentials: true
    });
    return response.data;
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    const response = await axios.post<Ticket>(this.baseUrl, ticket, {
      withCredentials: true
    });
    return response.data;
  }

  async updateTicket(id: number, ticket: Ticket): Promise<Ticket> {
    const response = await axios.put<Ticket>(`${this.baseUrl}/${id}`, ticket, {
      withCredentials: true
    });
    return response.data;
  }

  async deleteTicket(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  async getTicketById(id: number): Promise<Ticket> {
    const response = await axios.get<Ticket>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
    return response.data;
  }

  async getTicketsByAssignee(assignee: string): Promise<Ticket[]> {
    const response = await axios.get<Ticket[]>(`${this.baseUrl}/assignee/${assignee}`, {
      withCredentials: true
    });
    return response.data;
  }
}
