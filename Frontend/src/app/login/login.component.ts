import { Component } from '@angular/core';
import { NgIf } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";
import { FormsModule } from "@angular/forms";

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

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      console.log('User logged in successfully', user);
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
