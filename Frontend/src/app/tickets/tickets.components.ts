import { Component, OnInit } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = []; // Liste filtrée
  users: User[] = [];
  showCreateForm = false;
  isEditing = false; // Pour différencier la création de la mise à jour
  editingTicketId: number | null | undefined = null;

  // Variables pour les filtres
  searchTerm: string = ''; // Terme de recherche global
  filterStatus: string = ''; // Filtre par statut
  filterDueDate: string = ''; // Filtre par date d'échéance
  filterAssignee: string = ''; // Filtre par assignee
  filterPriority: string = ''; // Filtre par priorité

  // Modèle pour la création ou mise à jour
  newTicket: Ticket = {
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'LOW',
    assignee: '',
    reporter: '',
    createdDate: '',
    dueDate: ''
  };

  constructor(
    private ticketService: TicketService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.tickets = await this.ticketService.getTickets();
    this.filteredTickets = this.tickets; // Initialiser avec tous les tickets
    this.users = await this.userService.getUsers();
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    this.isEditing = false; // Réinitialise à l'état de création
    this.resetForm();
  }

  resetForm() {
    // Réinitialise le modèle de ticket pour la création d'un nouveau ticket
    this.newTicket = {
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'LOW',
      assignee: '',
      reporter: '',
      createdDate: '',
      dueDate: ''
    };
  }

  async createTicket() {
    const newTicket = await this.ticketService.createTicket(this.newTicket);
    this.tickets.push(newTicket);
    this.filteredTickets = this.tickets;
    this.toggleCreateForm(); // Cacher le formulaire après la création
    this.resetForm(); // Réinitialise le formulaire
  }

  async deleteTicket(id: number) {
    await this.ticketService.deleteTicket(id);
    this.tickets = this.tickets.filter(ticket => ticket.id !== id);
    this.filterTickets(); // Appliquer le filtre après suppression
  }

  // Méthode de filtrage améliorée pour prendre en compte les nouveaux critères
  filterTickets() {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearchTerm = (
        ticket.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.assignee.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.reporter.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.status.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.priority.toLowerCase().includes(lowerCaseSearchTerm) ||
        (ticket.comments && ticket.comments.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ticket.dueDate && ticket.dueDate.toString().toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ticket.createdDate && ticket.createdDate.toString().toLowerCase().includes(lowerCaseSearchTerm))
      );

      const matchesStatus = this.filterStatus === '' || ticket.status === this.filterStatus;
      const matchesDueDate = this.filterDueDate === '' || ticket.dueDate === this.filterDueDate;
      const matchesAssignee = this.filterAssignee === '' || ticket.assignee === this.filterAssignee;
      const matchesPriority = this.filterPriority === '' || ticket.priority === this.filterPriority;

      return matchesSearchTerm && matchesStatus && matchesDueDate && matchesAssignee && matchesPriority;
    });
  }

  // Activer le mode édition pour un ticket
  editTicket(ticket: Ticket) {
    this.showCreateForm = true;
    this.isEditing = true;
    this.editingTicketId = ticket.id ?? null; // Utiliser null si ticket.id est undefined
    this.newTicket = { ...ticket };
  }

  // Mettre à jour un ticket
  async updateTicket() {
    if (this.editingTicketId) {
      await this.ticketService.updateTicket(this.editingTicketId, this.newTicket);
      // Mettre à jour la liste locale
      const ticketIndex = this.tickets.findIndex(ticket => ticket.id === this.editingTicketId);
      if (ticketIndex !== -1) {
        this.tickets[ticketIndex] = { ...this.newTicket };
      }
      this.filteredTickets = this.tickets; // Mettre à jour les tickets filtrés
      this.toggleCreateForm(); // Cacher le formulaire après la mise à jour
      this.resetForm();
    }
  }
}
