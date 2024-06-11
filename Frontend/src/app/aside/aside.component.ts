import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {NgOptimizedImage} from "@angular/common";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    NgOptimizedImage
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserProfile().then(user => {
      this.user = user;
    }).catch(error => {
      console.error('Failed to load user data', error);
    });
  }
}
