import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { NgOptimizedImage, NgIf, NgClass } from "@angular/common";
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
    NgIf,
    NgClass
  ],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  user: User | undefined = undefined; // Initialisation à undefined
  isLoggedIn = false;
  userRole = '';
  defaultImage = 'https://img.freepik.com/photos-gratuite/portrait-jeune-homme-affaires-moustache-lunettes-rendu-3d_1142-51509.jpg?w=740&t=st=1718797177~exp=1718797777~hmac=b22839f330ca8ff8233e9daecd29bfafccb0a3788f670be5a1bb938798e18db1';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.authStatus.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.loadUserProfile();
        this.authService.userRole.subscribe(role => {
          this.userRole = role;
        });
      }
    });
  }

  private loadUserProfile() {
    this.userService.getUserProfile().then(user => {
      console.log(this.user)
      this.user = user;
    }).catch(error => {
      console.error('Failed to load user data', error);
    });
  }

  getUserImage(): string {
    if (this.user && this.user.image) {
      return this.user.image;
    }
    return this.defaultImage;
  }

  isRole(role: string): boolean {
    return this.userRole === role;
  }

  close() {
    this.closeSidebar.emit();
  }

  isLargeScreen(): boolean {
    return window.innerWidth >= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isLargeScreen();
  }
}
