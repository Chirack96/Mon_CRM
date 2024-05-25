import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  newOrder: Order = { id: 0, product: { id: 0, name: '', description: '', price: 0, stock: 0 }, quantity: 0, price: 0, date: '', status: '' };
  showAddOrderForm: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  async fetchOrders() {
    try {
      this.orders = await this.orderService.getAllOrders();
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  }

  async createOrder() {
    try {
      const createdOrder = await this.orderService.createOrder(this.newOrder);
      this.orders.push(createdOrder);
      this.newOrder = { id: 0, product: { id: 0, name: '', description: '', price: 0, stock: 0 }, quantity: 0, price: 0, date: '', status: '' }; // Réinitialiser le formulaire
      this.showAddOrderForm = false; // Masquer le formulaire après la création de la commande
    } catch (error) {
      console.error('Error creating order', error);
    }
  }

  async deleteOrder(id: number) {
    try {
      await this.orderService.deleteOrder(id);
      this.orders = this.orders.filter(order => order.id !== id);
    } catch (error) {
      console.error('Error deleting order', error);
    }
  }
}
