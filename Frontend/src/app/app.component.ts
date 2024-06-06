import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './services/auth.service';
import { AsideComponent } from './aside/aside.component';
import {HomeComponent} from "./home/home.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsideComponent, HomeComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  title: string = 'frontend';

  ngOnInit(): void {
    this.authService.checkInitialLoginState();
  }

  isLoggedIn() {
    return this.authService.authStatus();
  }

}
