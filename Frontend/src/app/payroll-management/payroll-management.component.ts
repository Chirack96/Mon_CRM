import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

interface PayrollEntry {
  employeeFirstName: string;
  employeeLastName: string;
  amount: number;
  paymentDate: string;
}

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  templateUrl: './payroll-management.component.html',
  styleUrls: ['./payroll-management.component.scss'],
  imports: [
    CurrencyPipe,
    DatePipe,
    NgForOf,
    FormsModule,
    NgIf
  ],
  providers: [UserService]
})
export class PayrollManagementComponent implements OnInit {
  payrollEntries: PayrollEntry[] = [];
  showForm: boolean = false;
  newPayrollEntry: PayrollEntry = { employeeFirstName: '', employeeLastName: '', amount: 0, paymentDate: '' };
  users: User[] = [];

  constructor(private userService: UserService) {}

  async ngOnInit() {
    try {
      this.users = await this.userService.getUsers();
      console.log('Users loaded:', this.users); // Log pour vérifier les utilisateurs chargés
    } catch (error) {
      console.error('Failed to load users', error);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  addPayrollEntry() {
    console.log('Adding payroll entry:', this.newPayrollEntry); // Log pour vérifier l'entrée de paie
    this.payrollEntries.push({ ...this.newPayrollEntry });
    this.newPayrollEntry = { employeeFirstName: '', employeeLastName: '', amount: 0, paymentDate: '' };
    this.showForm = false;
  }

  editPayrollEntry(entry: PayrollEntry) {
    // Logic to edit payroll entry
  }

  deletePayrollEntry(entry: PayrollEntry) {
    this.payrollEntries = this.payrollEntries.filter(e => e !== entry);
  }
}
