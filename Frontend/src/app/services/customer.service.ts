import { Injectable } from '@angular/core';
import axios from 'axios';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor() { }

  async getAllCustomers(): Promise<Customer[]> {
    const response = await axios.get<Customer[]>(this.baseUrl);
    return response.data;
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const response = await axios.post<Customer>(this.baseUrl, customer);
    return response.data;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await axios.get<Customer>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
