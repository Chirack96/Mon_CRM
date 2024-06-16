import { Component, OnInit } from '@angular/core';
import { UserLog } from "../models/user-log.model";
import { UserLogService } from "../services/user-log.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {
  userLogs: UserLog[] = [];
  filteredLogs: UserLog[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currentFilter: 'all' | 'success' | 'failed' = 'all';  // Defines current filter type

  constructor(private userLogService: UserLogService) {}

  ngOnInit(): void {
    this.loadUserLogs();
  }

  async loadUserLogs(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.userLogs = await this.userLogService.getUserLogs();
      this.filteredLogs = this.userLogs; // Initially display all logs
    } catch (error) {
      console.error('Failed to load user logs:', error);
      this.error = 'Failed to load user logs';
    } finally {
      this.isLoading = false;
    }
  }

  // Function to filter logs based on the filter type
  filterLogs(filter: 'all' | 'success' | 'failed'): void {
    this.currentFilter = filter;
    switch(filter) {
      case 'success':
        this.filteredLogs = this.userLogs.filter(log => log.details === 'Login successful');
        break;
      case 'failed':
        this.filteredLogs = this.userLogs.filter(log => log.details !== 'Login successful');
        break;
      default:
        this.filteredLogs = this.userLogs;
        break;
    }
  }
}
