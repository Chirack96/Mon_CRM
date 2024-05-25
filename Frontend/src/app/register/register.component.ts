import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {User} from "../models/user.model";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: User = new User(0, '', '', '', '', '');
  confirmPassword: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService) {}

  async register() {
    if (this.user.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      const response = await this.authService.register(this.user);
      console.log('User registered successfully', response);
    } catch (error) {
      console.error('Error registering user', error);
    }
  }

  togglePasswordVisibility(fieldId: string) {
    if (fieldId === 'password') {
      this.showPassword = !this.showPassword;
      const passwordField: any = document.getElementById(fieldId);
      passwordField.type = this.showPassword ? 'text' : 'password';
    } else if (fieldId === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
      const confirmPasswordField: any = document.getElementById(fieldId);
      confirmPasswordField.type = this.showConfirmPassword ? 'text' : 'password';
    }
  }

}
