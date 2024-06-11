import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  verificationCode: string = '';
  userId: number | null = null;
  showPassword = false;
  loginStage = 1;  // 1 pour le credentials, 2 pour verification code
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.clearMessages();
    if (this.loginStage === 1) {
      try {
        const result = await this.authService.login(this.email, this.password);
        this.userId = result.userId;
        this.loginStage = 2;
        this.successMessage = "Please enter the verification code sent to your email.";
      } catch (error) {
        this.errorMessage = 'Login failed. Please check your email or password and try again.';
        console.error('Login failed:', error);
      }
    }
  }

  async verifyCode() {
    this.clearMessages();
    if (this.userId && this.verificationCode) {
      try {
        const result = await this.authService.verifyCode(this.userId, this.verificationCode);
        this.authService.storeToken(result.token);
        this.successMessage = 'You are successfully logged in. Redirecting to dashboard...';
        this.authService.authStatus.set(true);
        await this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorMessage = 'Verification failed. Please check the code and try again.';
        console.error('Verification failed:', error);
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
