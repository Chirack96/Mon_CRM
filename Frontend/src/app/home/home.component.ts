import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    LoginComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
