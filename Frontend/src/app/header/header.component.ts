import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgClass
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged = false;
  isLoading = true;
  menuOpen = false;
  userRole = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.authService.authStatus.subscribe(status => {
        this.isLogged = status;
      }),
      this.authService.isLoading.subscribe(loading => {
        this.isLoading = loading;
      }),
      this.authService.userRole.subscribe(role => {
        this.userRole = role;
      })
    );
  }

  logout(): void {
    this.authService.logout().then(r => console.log('User logged out'));
    this.router.navigate(['/login']).then(r => console.log('Navigated to login page'));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  isRole(role: string): boolean {
    return this.userRole === role;
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateAndCloseMenu() {
    this.menuOpen = false;
  }
}
