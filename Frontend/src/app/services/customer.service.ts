import { Injectable } from '@angular/core';
import axios from 'axios';
import { Customer } from '../models/customer.model';
import { AuthService } from './auth.service';
import {Order} from "../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private authService: AuthService) { }

  async getAllCustomers(): Promise<Customer[]> {
    const response = await axios.get<Customer[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const response = await axios.post<Customer>(this.baseUrl, customer, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await axios.get<Customer>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    const response = await axios.put<Customer>(`${this.baseUrl}/${customer.id}`, customer, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }
  async getCustomerOrders(id: number): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${this.baseUrl}/${id}/orders`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }
}
