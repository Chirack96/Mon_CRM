import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, NgClass} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { AsideComponent } from './aside/aside.component';
import { HomeComponent } from "./home/home.component";
import { AsyncPipe, NgIf } from "@angular/common";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsideComponent, HomeComponent, NgIf, AsyncPipe, NgClass],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  darkMode: boolean = false;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.authStatus;
    this.isLoading$ = this.authService.isLoading;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.authService.initializeLoginState().then(r => r);
    if (this.isBrowser) {
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      this.updateDarkModeClass();
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.isBrowser) {
      localStorage.setItem('darkMode', this.darkMode.toString());
      this.updateDarkModeClass();
    }
  }

  updateDarkModeClass() {
    const bodyClassList = document.body.classList;
    if (this.darkMode) {
      bodyClassList.add('dark');
    } else {
      bodyClassList.remove('dark');
    }
  }
}
