import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user: User = new User(); // Initialisation de l'utilisateur
  isEditable = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile().then(r => console.log('User profile loaded:', this.user))
      .catch(e => console.error('Failed to load user profile:', e));
  }

  async loadUserProfile() {
    try {
      this.user = await this.userService.getUserProfile();
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
  }
  cancelEdit() {
    this.isEditable = false;
    this.loadUserProfile().then(r => console.log('Cancel editing' , this.user) ) // Recharge les informations initiales pour annuler les modifications
  }
  saveProfile(): void {
    this.userService.updateUser(this.user.id, this.user)
      .then(() => console.log('Profile Saved', this.user))
      .catch(error => console.error('Failed to save profile:', error));
    this.isEditable = false;
  }
}
