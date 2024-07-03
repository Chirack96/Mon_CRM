import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, CurrencyPipe, isPlatformBrowser, NgForOf } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { Order } from '../models/order.model';
import { Customer } from '../models/customer.model';
import { format, parseISO } from 'date-fns';
import { TaskService } from '../services/task.service';
import { RouterLink } from "@angular/router";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-sale-overview',
  templateUrl: './sale-overview.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    NgForOf,
    CurrencyPipe
  ],
  styleUrls: ['./sale-overview.component.scss']
})
export class SaleOverviewComponent implements OnInit {
  totalSales: number = 0;
  newCustomers: number = 0;
  totalOrders: number = 0;
  pendingTasks: number = 0;
  pendingTasksProgress: number = 0;
  topSellingProducts: any[] = [];
  leastSellingProducts: any[] = [];
  revenueByCustomer: { name: string, revenue: number }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderService: OrderService,
    private customerService: CustomerService,
    private taskService: TaskService,
    private productService: ProductService
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

      const pendingTasks = await this.taskService.getTasksByStatus('pending');
      this.pendingTasks = pendingTasks.length;
      this.pendingTasksProgress = this.calculatePendingTasksProgress(pendingTasks.length);

      const topSellingProductsRaw = await this.orderService.getTopSellingProducts(5);
      this.topSellingProducts = await this.getProductsDetails(topSellingProductsRaw);
      console.log('Top Selling Products:', this.topSellingProducts);
      this.renderTopSellingChart(this.topSellingProducts);

      const leastSellingProductsRaw = await this.orderService.getLeastSellingProducts(5);
      this.leastSellingProducts = await this.getProductsDetails(leastSellingProductsRaw);
      console.log('Least Selling Products:', this.leastSellingProducts);
      this.renderLeastSellingChart(this.leastSellingProducts);

      for (const customer of customers) {
        const revenue = await this.orderService.getRevenueByCustomer(customer.id);
        this.revenueByCustomer.push({ name: `${customer.firstName} ${customer.lastName}`, revenue });
      }
      this.renderRevenueByCustomerChart(this.revenueByCustomer);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }

  async getProductsDetails(productsRaw: any[]): Promise<any[]> { // Using any here
    const detailedProducts = [];
    for (const productRaw of productsRaw) {
      const productDetails = await this.productService.getProductById(productRaw.productId);
      detailedProducts.push({ name: productDetails.name, quantity: productRaw.quantity });
    }
    return detailedProducts;
  }

  calculateDashboardMetrics(orders: Order[]) {
    this.totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    this.totalOrders = orders.length;
  }

  organizeDataByMonth(orders: Order[]): { labels: string[], data: number[] } {
    const monthlySales: { [key: string]: number } = {};
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    orders.forEach(order => {
      const month = format(parseISO(order.orderDate), 'MMMM');
      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }
      monthlySales[month] += order.totalPrice;
    });

    // Sort months by defined order
    const labels = monthOrder.filter(month => monthlySales[month] !== undefined);
    const data = labels.map(month => monthlySales[month]);

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

  renderTopSellingChart(products: { name: string, quantity: number }[]) {
    const ctx = document.getElementById('topSellingChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: products.map(product => product.name),
          datasets: [{
            label: 'Quantity Sold',
            data: products.map(product => product.quantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
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

  renderLeastSellingChart(products: any[]) { // Using any here
    const ctx = document.getElementById('leastSellingChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: products.map(product => product.name),
          datasets: [{
            label: 'Quantity Sold',
            data: products.map(product => product.quantity),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        },
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

  renderRevenueByCustomerChart(customers: { name: string, revenue: number }[]) {
    const ctx = document.getElementById('revenueByCustomerChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: customers.map(customer => customer.name),
          datasets: [{
            label: 'Revenue',
            data: customers.map(customer => customer.revenue),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
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

  calculateNewCustomers(customers: Customer[]): number {
    const currentMonth = format(new Date(), 'MMMM');
    return customers.filter(customer => format(parseISO(customer.createdAt), 'MMMM') === currentMonth).length;
  }

  calculatePendingTasksProgress(pendingTasksCount: number): number {
    const totalTasks = 100; // Suppose you have a total task count of 100
    return (pendingTasksCount / totalTasks) * 100;
  }
}
