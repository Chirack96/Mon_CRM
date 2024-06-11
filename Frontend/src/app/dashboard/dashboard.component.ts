import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import {Chart, registerables} from 'chart.js';
import {OrderService} from '../services/order.service';
import {CustomerService} from '../services/customer.service';
import {Order} from '../models/order.model';
import {Customer} from '../models/customer.model';
import {format, parseISO} from 'date-fns';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalSales: number = 0;
  newCustomers: number = 0;
  totalOrders: number = 0;
  pendingTasks: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderService: OrderService,
    private customerService: CustomerService,
    private taskService: TaskService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData().then(r => console.log('Dashboard data loaded'));
    }
  }

  async loadDashboardData() {
    try {
      const orders: Order[] = await this.orderService.getOrderByStatus('validated');
      this.calculateDashboardMetrics(orders);
      const salesData = this.organizeDataByMonth(orders);
      this.renderSalesChart(salesData);

      const customers: Customer[] = await this.customerService.getAllCustomers();
      this.newCustomers = this.calculateNewCustomers(customers);

      this.pendingTasks = await this.calculatePendingTasks();

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }

  calculateDashboardMetrics(orders: Order[]) {
    this.totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    this.totalOrders = orders.length;
  }

  organizeDataByMonth(orders: Order[]): { labels: string[], data: number[] } {
    const monthlySales: { [key: string]: number } = {};

    orders.forEach(order => {
      const month = format(parseISO(order.orderDate), 'MMMM');
      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }
      monthlySales[month] += order.totalPrice;
    });

    const labels = Object.keys(monthlySales);
    const data = Object.values(monthlySales);

    return { labels, data };
  }

  renderSalesChart(salesData: { labels: string[], data: number[] }) {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: salesData.labels,
          datasets: [{
            label: 'Sales',
            data: salesData.data,
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

  calculateNewCustomers(customers: Customer[]): number {
    const currentMonth = format(new Date(), 'MMMM');
    return customers.filter(customer => format(parseISO(customer.createdAt), 'MMMM') === currentMonth).length;
  }

  async calculatePendingTasks(): Promise<number> {
    const pendingTasks = await this.taskService.getTasksByStatus('pending');
    return pendingTasks.length;
  }


}
