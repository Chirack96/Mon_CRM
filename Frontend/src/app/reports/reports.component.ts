import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderSalesChart();
  }

  renderSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Sales',
          data: [1200, 1900, 3000, 5000, 2300, 3500],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });
  }
}
