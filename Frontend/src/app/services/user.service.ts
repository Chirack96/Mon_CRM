import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private authService: AuthService) {}

  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.baseUrl}`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async createUser(user: User): Promise<User> {
    const response = await axios.post<User>(this.baseUrl, user, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async updateUser(id: number, user: User): Promise<User> {
    const response = await axios.put<User>(`${this.baseUrl}/${id}`, user, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  async deleteUsersInRange(startId: number, endId: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/range`, {
      params: { startId, endId },
      headers: this.authService.getAuthHeaders()
    });
  }

  async createMultipleUsers(count: number): Promise<User[]> {
    const response = await axios.post<User[]>(`${this.baseUrl}/create-multiple`, null, {
      params: { count },
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async getUserByGroupe(groupe: string): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/groupe/${groupe}`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }
}
