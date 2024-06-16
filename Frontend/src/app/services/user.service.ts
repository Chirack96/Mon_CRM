import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

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

  async getUserProfile(): Promise<User> {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User ID is not available');
      const response = await axios.get<User>(`${this.baseUrl}/${userId}`, {
        headers: this.authService.getAuthHeaders()
      });
      return response.data;
    } else {
      throw new Error('localStorage is not available');
    }
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
}
