import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  standalone: true,
  styleUrls: ['./performance-dashboard.component.scss']
})
export class PerformanceDashboardComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> | null = null;
  private chart: Chart | null = null;

  public performanceData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
    datasets: [{
      label: 'Performance',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: '#4a90e2',
      borderColor: '#4a90e2',
      borderWidth: 1
    }]
  };

  constructor() { }

  ngAfterViewInit(): void {
    if (this.canvas && this.canvas.nativeElement) {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: this.performanceData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  openModal(): void {
    // Logic to open modal
  }
}
