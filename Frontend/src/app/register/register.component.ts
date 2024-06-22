import { Component } from '@angular/core';
import { NgIf } from "@angular/common";
import { User } from "../models/user.model";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = new User();
  confirmPassword: string = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
      return;
    }
    try {
      this.errorMessage = ''; // Clear previous errors
      this.showErrorMessage = false;
      this.user.groupe = this.user.groupe || '';
      const response = await this.authService.register(this.user);
      if (response) {
        console.log('User registered successfully', response);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { message: 'You can now log in' } });
        }, 2000); // Wait for 2 seconds before redirecting
      }
    } catch (error: any) {
      console.error('Error registering user', error);
      if (error.status === 409) { // HTTP 409 Conflict for email already exists
        this.errorMessage = 'Email already exists';
        this.showErrorMessage = true
      } else {
        this.errorMessage = error.error?.message || 'An error occurred during registration';
      }
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
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
