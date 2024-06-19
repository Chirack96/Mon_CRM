import { Injectable } from '@angular/core';
import axios from 'axios';
import { Customer } from '../models/customer.model';
import {Order} from "../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor() { }

  async getAllCustomers(): Promise<Customer[]> {
    const response = await axios.get<Customer[]>(this.baseUrl, { withCredentials: true });
    return response.data;
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const response = await axios.post<Customer>(this.baseUrl, customer, { withCredentials: true });
    return response.data;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await axios.get<Customer>(`${this.baseUrl}/${id}`, { withCredentials: true });
    return response.data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    const response = await axios.put<Customer>(`${this.baseUrl}/${customer.id}`, customer, { withCredentials: true });
    return response.data;
  }

  async getCustomerOrders(id: number): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${this.baseUrl}/${id}/orders`, { withCredentials: true });
    return response.data;
  }
}
