import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Report {
  id: number;
  title: string;
  summary: string;
  date: Date;
  department: string;
}

@Component({
  selector: 'app-hr-reports',
  templateUrl: './hr-reports.component.html',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule],
  styleUrls: ['./hr-reports.component.scss']
})
export class HRReportsComponent {
  searchTerm: string = '';
  selectedFilter: keyof Report | '' = '';
  selectedReport: Report | null = null;

  reports = [
    { id: 1, title: 'Rapport Annuel 2023', summary: 'Résumé du rapport annuel.', date: new Date(), department: 'Finance' },
    { id: 2, title: 'Rapport Trimestriel Q1', summary: 'Résumé du rapport trimestriel.', date: new Date(new Date().setMonth(new Date().getMonth() - 3)), department: 'RH' },
    // Add more reports here
  ];

  constructor() { }

  exportReports(): void {
    console.log('Reports exported');
  }

  viewReport(reportId: number): void {
    this.selectedReport = this.reports.find(report => report.id === reportId) || null;
    console.log(`View details of report ${reportId}`);
  }

  filteredReports(): Report[] {
    return this.reports.filter(report => {
      return (this.searchTerm === '' || report.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.selectedFilter === '' || report[this.selectedFilter as keyof Report]);
    });
  }
}
