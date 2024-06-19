import { Injectable } from '@angular/core';
import axios from 'axios';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor() {}

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(this.baseUrl, {
        withCredentials: true
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
        withCredentials: true
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
        withCredentials: true
      });
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const response = await axios.put<Order>(`${this.baseUrl}/${id}/status`, { status }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  async updateOrder(id: number, order: Order): Promise<Order> {
    try {
      const response = await axios.put<Order>(`${this.baseUrl}/${id}`, order, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }

  async getOrderByStatus(status: string): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(`${this.baseUrl}/status/${status}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders by status:', error);
      throw error;
    }
  }
}
