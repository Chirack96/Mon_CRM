import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
  private authUrl = 'http://localhost:8080/api/auth';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.baseUrl}`, {
      withCredentials: true
    });
    console.log(response)
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
    console.log(response)
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const response = await axios.get<User>(`${this.authUrl}/user-profile`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        throw new Error('Failed to load user profile');
      }
    } else {
      throw new Error('localStorage is not available');
    }
  }

  async createUser(user: User): Promise<User> {
    const response = await axios.post<User>(this.baseUrl, user, {
      withCredentials: true
    });
    return response.data;
  }

  async updateUser(id: number, user: User): Promise<User> {
    const response = await axios.put<User>(`${this.baseUrl}/${id}`, user, {
      withCredentials: true
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }
}
