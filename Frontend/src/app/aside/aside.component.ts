import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { NgOptimizedImage, NgIf } from "@angular/common";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent implements OnInit {
  user: User | undefined;
  isLoggedIn = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.authStatus.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.loadUserProfile();
      }
    });
  }

  private loadUserProfile() {
    this.userService.getUserProfile().then(user => {
      this.user = user;
    }).catch(error => {
      console.error('Failed to load user data', error);
    });
  }
}
