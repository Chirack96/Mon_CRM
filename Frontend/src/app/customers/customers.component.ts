import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  newCustomer: Customer = { id: 0, firstName: '', lastName: '', email: '', address: '', phoneNumber: '', createdAt: '' };
  showAddCustomerForm: boolean = false;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.fetchCustomers();
  }

  async fetchCustomers() {
    try {
      this.customers = await this.customerService.getAllCustomers();
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  async createCustomer() {
    try {
      const createdCustomer = await this.customerService.createCustomer(this.newCustomer);
      this.customers.push(createdCustomer);
      this.newCustomer = { id: 0, firstName: '', lastName: '', email: '', address: '', phoneNumber: '', createdAt: '' }; // Réinitialiser le formulaire
      this.showAddCustomerForm = false; // Masquer le formulaire après la création du client
    } catch (error) {
      console.error('Error creating customer', error);
    }
  }

  async deleteCustomer(id: number) {
    try {
      await this.customerService.deleteCustomer(id);
      this.customers = this.customers.filter(customer => customer.id !== id);
    } catch (error) {
      console.error('Error deleting customer', error);
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }
}
