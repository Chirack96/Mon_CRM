import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged = false;
  isLoading = true;
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
}
