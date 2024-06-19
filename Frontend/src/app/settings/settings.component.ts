import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

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
  user: User = new User();
  isEditable = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile().then(() => console.log('User profile loaded:', this.user))
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
    this.loadUserProfile().then(() => console.log('Cancel editing', this.user));
  }

  saveProfile() {
    this.userService.updateUser(this.user.id, this.user)
      .then(() => {
        console.log('Profile saved', this.user);
        this.isEditable = false;
      })
      .catch(error => console.error('Failed to save profile:', error));
  }
}
