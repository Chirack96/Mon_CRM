import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = {id: 0, firstname: '', lastname: '', email: '', password: '', groupe: ''};
  selectedUser: User | null = null;
  showAddUserForm: boolean = false;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.fetchUsers().catch(error => console.error('Error fetching users:', error));
  }

  async fetchUsers(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();
    } catch (error) {
      console.error('Error fetching users', error);
    }
  }

  async createUser(): Promise<void> {
    try {
      const createdUser = await this.userService.createUser(this.newUser);
      this.users.push(createdUser);
      this.newUser = {id: 0, firstname: '', lastname: '', email: '', password: '', groupe: ''}; // Réinitialiser le formulaire
      this.showAddUserForm = false; // Masquer le formulaire après la création de l'utilisateur
      this.errorMessage = null; // Réinitialiser le message d'erreur
    } catch (error) {
      console.error('Error creating user', error);
      this.errorMessage = 'Failed to create user. Please make sure you have the correct permissions.';
    }
  }

  async updateUser(): Promise<void> {
    if (this.selectedUser) {
      try {
        const updatedUser = await this.userService.updateUser(this.selectedUser.id, this.selectedUser);
        const index = this.users.findIndex(user => user.id === this.selectedUser?.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
      } catch (error) {
        console.error('Error updating user', error);
      }
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.userService.deleteUser(id);
      this.users = this.users.filter(user => user.id !== id);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  }

  selectUser(user: User): void {
    this.selectedUser = {...user};
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  async getUser(id: number): Promise<void> {
    try {
      await this.userService.getUser(id);
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }
}
