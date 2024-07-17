import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import {DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe,
    NgClass,
    UpperCasePipe
  ],
  styleUrls: ['./customers.component.scss'],
  animations: [
    trigger('fadeInSlideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  newCustomer: Customer = { id: 0, firstName: '', lastName: '', email: '', address: '', phoneNumber: '', createdAt: '' };
  selectedCustomer: Customer | null = null;
  showAddCustomerForm: boolean = false;
  showEditCustomerModal: boolean = false;
  searchTerm: string = '';
  userRole = '';
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private customerService: CustomerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchCustomers().then(() => console.log('Customers fetched'));
    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    });
  }

  async fetchCustomers() {
    try {
      this.customers = await this.customerService.getAllCustomers();
      this.filteredCustomers = this.customers;
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  }

  async createCustomer() {
    try {
      const createdCustomer = await this.customerService.createCustomer(this.newCustomer);
      this.customers.push(createdCustomer);
      this.filteredCustomers.push(createdCustomer);
      this.newCustomer = { id: 0, firstName: '', lastName: '', email: '', address: '', phoneNumber: '', createdAt: '' }; // Réinitialiser le formulaire
      this.showAddCustomerForm = false; // Masquer le formulaire après la création du client
      await this.fetchCustomers();
      this.showAlert('Customer created successfully!', 'success');
    } catch (error) {
      console.error('Error creating customer', error);
      this.showAlert('Failed to create customer.', 'error');
    }
  }

  async updateCustomer() {
    try {
      if (this.selectedCustomer) {
        const updatedCustomer = await this.customerService.updateCustomer(this.selectedCustomer);
        const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
          this.customers[index] = updatedCustomer;
          this.filteredCustomers[index] = updatedCustomer;
        }
        this.showEditCustomerModal = false;
        this.selectedCustomer = null;
        await this.fetchCustomers();
        this.showAlert('Customer updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating customer', error);
      this.showAlert('Failed to update customer.', 'error');
    }
  }

  async deleteCustomer(id: number) {
    try {
      await this.customerService.deleteCustomer(id);
      this.customers = this.customers.filter(customer => customer.id !== id);
      this.filteredCustomers = this.filteredCustomers.filter(customer => customer.id !== id);
      this.showAlert('Customer deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting customer', error);
      this.showAlert('Failed to delete customer.', 'error');
    }
  }

  editCustomer(customer: Customer) {
    this.selectedCustomer = { ...customer }; // Copier les données du client sélectionné
    this.showEditCustomerModal = true; // Afficher le formulaire d'édition
  }

  closeEditModal() {
    this.showEditCustomerModal = false;
    this.selectedCustomer = null;
  }

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer =>
      customer.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleForm() {
    this.showAddCustomerForm = !this.showAddCustomerForm;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }

  confirmEdit() {
    this.updateCustomer().then(r => r);
  }

  isRole(role: string): boolean {
    return this.userRole === role;
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
}
