import { Component } from '@angular/core';

@Component({
  selector: 'app-hr-reports',
  templateUrl: './hr-reports.component.html',
  standalone: true,
  styleUrls: ['./hr-reports.component.scss']
})
export class HRReportsComponent {

  constructor() { }

  exportReports(): void {
    // Logic to export reports
    console.log('Reports exported');
  }
}
