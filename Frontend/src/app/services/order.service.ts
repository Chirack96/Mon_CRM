import { Injectable } from '@angular/core';
import axios from 'axios';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor() { }

  async getAllOrders(): Promise<Order[]> {
    const response = await axios.get<Order[]>(this.baseUrl);
    return response.data;
  }

  async createOrder(order: Order): Promise<Order> {
    const response = await axios.post<Order>(this.baseUrl, order);
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await axios.get<Order>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
