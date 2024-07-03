import { Component, OnInit } from '@angular/core';
import { UserLog } from "../models/user-log.model";
import { UserLogService } from "../services/user-log.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    FormsModule // Pour utiliser ngModel
  ],
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {
  userLogs: UserLog[] = [];
  filteredLogs: UserLog[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currentFilter: 'all' | 'success' | 'failed' = 'all';  // Définit le type de filtre actuel
  searchQuery: string = ''; // initialise la recherche à une chaîne vide

  constructor(private userLogService: UserLogService) {}

  ngOnInit(): void {
    this.loadUserLogs().then(r => r).catch(e => e);
  }

  async loadUserLogs(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.userLogs = await this.userLogService.getUserLogs();
      this.filteredLogs = this.userLogs; // Afficher initialement tous les logs
    } catch (error) {
      console.error('Failed to load user logs:', error);
      this.error = 'Failed to load user logs';
    } finally {
      this.isLoading = false;
    }
  }

  // Fonction pour filtrer les logs en fonction du type de filtre
  filterLogs(filter: 'all' | 'success' | 'failed'): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  // Appelle la méthode applyFilters lors de la saisie de l'utilisateur
  searchLogs(): void {
    this.applyFilters();
  }

  // Méthode pour appliquer tous les filtres
  private applyFilters(): void {
    let logs = this.userLogs;

    if (this.currentFilter === 'success') {
      logs = logs.filter(log => log.details === 'Login successful');
    } else if (this.currentFilter === 'failed') {
      logs = logs.filter(log => log.details !== 'Login successful');
    }

    if (this.searchQuery) {
      logs = logs.filter(log => log.email.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    this.filteredLogs = logs;
  }
}
