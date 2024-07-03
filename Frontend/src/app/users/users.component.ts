import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [NgForOf, FormsModule, NgIf, NgClass],
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = { id: 0, firstname: '', lastname: '', email: '', password: '', groupe: '' };
  selectedUser: User | null = null;
  showAddUserForm: boolean = false;
  errorMessage: string | null = null;
  searchTerm: string = '';
  showModal: boolean = false; // Nouveau boolean pour contrôler la modal
  isEditingFirstname: boolean = false; // Contrôle de l'édition du prénom
  isEditingLastname: boolean = false; // Contrôle de l'édition du nom de famille

  @ViewChild('firstnameInput', { static: false }) firstnameInput!: ElementRef;
  @ViewChild('lastnameInput', { static: false }) lastnameInput!: ElementRef;

  constructor(private userService: UserService) { }

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
      this.newUser = { id: 0, firstname: '', lastname: '', email: '', password: '', groupe: '' };
      this.showAddUserForm = false;
      this.errorMessage = null;
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
        this.showModal = false; // Fermer la modal après mise à jour
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
    this.selectedUser = { ...user };
    this.showModal = true; // Ouvrir la modal
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.showModal = false; // Fermer la modal
    this.isEditingFirstname = false; // Réinitialiser l'édition du prénom
    this.isEditingLastname = false; // Réinitialiser l'édition du nom de famille
  }

  async getUser(id: number): Promise<void> {
    try {
      const user = await this.userService.getUser(id);
      this.selectedUser = { ...user, image: user.image };
      this.showModal = true; // Ouvrir la modal
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }

  filteredUsers(): User[] {
    return this.users.filter(user => {
      return this.searchTerm === '' || user.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) || user.lastname.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  toggleEdit(field: string): void {
    if (field === 'firstname') {
      this.isEditingFirstname = !this.isEditingFirstname;
      if (this.isEditingFirstname) {
        setTimeout(() => this.firstnameInput.nativeElement.focus(), 0);
      }
    } else if (field === 'lastname') {
      this.isEditingLastname = !this.isEditingLastname;
      if (this.isEditingLastname) {
        setTimeout(() => this.lastnameInput.nativeElement.focus(), 0);
      }
    }
  }
}
