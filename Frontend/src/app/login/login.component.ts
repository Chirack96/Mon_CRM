import { Component } from '@angular/core';
import { NgIf } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const result = await this.authService.login(this.email, this.password);
      console.log('User logged in successfully', result);
      this.router.navigate(['/dashboard']).then(() => console.log('Navigated to dashboard.'));
    } catch (error) {
      console.error('Invalid email or password', error);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.showPassword ? 'text' : 'password';
  }
}
