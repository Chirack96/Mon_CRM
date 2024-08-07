import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

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
  loginStage = 1;  // 1 pour les identifiants, 2 pour le code de vérification
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;
  isLoadingStep = false;

  @ViewChild('passwordField') passwordField!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.clearMessages();
    this.isLoadingStep = true;
    if (this.loginStage === 1) {
      try {
        const result = await this.authService.login(this.email, this.password);
        if (result) {
          this.userId = result.userId;
          this.loginStage = 2;
          this.successMessage = "Please enter the verification code sent to your email.";
        } else {
          this.errorMessage = 'Login failed. Please check your email or password and try again.';
        }
      } catch (error) {
        this.errorMessage = 'Login failed. Please check your email or password and try again.';
        console.error('Login failed:', error);
      } finally {
        this.isLoadingStep = false;
      }
    }
  }

  async verifyCode() {
    this.clearMessages();
    this.isLoadingStep = true;
    if (this.userId && this.verificationCode) {
      try {
        const success = await this.authService.verifyCode(this.userId, this.verificationCode);
        if (success) {
          this.successMessage = 'You are successfully logged in. Redirecting to dashboard...';
          await this.router.navigate(['/orders']);
        } else {
          this.errorMessage = 'Verification failed. Please check the code and try again.';
        }
      } catch (error) {
        this.errorMessage = 'Verification failed. Please check the code and try again.';
        console.error('Verification failed:', error);
      } finally {
        this.isLoadingStep = false;
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField = this.passwordField.nativeElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
