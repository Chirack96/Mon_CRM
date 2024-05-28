import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { effect } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    NgIf
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLogged = false;
  isLoading = true;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      this.isLogged = this.authService.authStatus();
    });
    effect(() => {
      this.isLoading = this.authService.isLoading();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(r => r);
  }
}
