import { Component, signal } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgOptimizedImage,
    RouterOutlet,
    RouterLink
  ],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAuthenticated() {
    return AuthService.isAuthenticated();

  }
}
