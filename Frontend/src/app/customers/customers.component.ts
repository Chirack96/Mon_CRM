import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService} from "../services/auth.service";

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
  styleUrls: ['./customers.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  newCustomer: Customer = { id: 0, firstName: '', lastName: '', email: '', address: '', phoneNumber: '', createdAt: '' };
  showAddCustomerForm: boolean = false;
  userRole = '';


  constructor(private customerService: CustomerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchCustomers().then(r => console.log('Customers fetched'));
    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    })
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

  isRole(role: string): boolean {
    console.log(this.authService.userRole);
    return this.userRole === role;
  }
}
