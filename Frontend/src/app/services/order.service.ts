import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private authService: AuthService) {}

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(this.baseUrl, {
        headers: this.authService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  async createOrder(order: Order): Promise<Order> {
    try {
      const response = await axios.post<Order>(this.baseUrl, order, {
        headers: this.authService.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  async deleteOrder(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, {
        headers: this.authService.getAuthHeaders()
      });
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }
}
