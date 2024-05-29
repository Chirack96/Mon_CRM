import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

}
