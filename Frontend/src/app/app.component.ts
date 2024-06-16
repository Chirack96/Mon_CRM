import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { AsideComponent } from './aside/aside.component';
import { HomeComponent } from "./home/home.component";
import {AsyncPipe, NgIf} from "@angular/common";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsideComponent, HomeComponent, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    // Utilisez un observable pour réagir aux changements de l'état d'authentification.
    this.isLoggedIn$ = this.authService.authStatus;
  }

  ngOnInit(): void {
    // Initialise l'état de connexion à partir de la session existante si applicable
    this.authService.checkInitialLoginState();
  }
}
