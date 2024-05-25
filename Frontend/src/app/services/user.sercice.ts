import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users'; // Changez l'URL selon votre configuration

  constructor() {}

  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.baseUrl}`);
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createUser(user: User): Promise<User> {
    const response = await axios.post<User>(this.baseUrl, user);
    return response.data;
  }

  async updateUser(id: number, user: User): Promise<User> {
    const response = await axios.put<User>(`${this.baseUrl}/${id}`, user);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async deleteUsersInRange(startId: number, endId: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/range`, {
      params: { startId, endId }
    });
  }

  async createMultipleUsers(count: number): Promise<User[]> {
    const response = await axios.post<User[]>(`${this.baseUrl}/create-multiple`, null, {
      params: { count }
    });
    return response.data;
  }

  async getUserByGroupe(groupe: string): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/groupe/${groupe}`);
    return response.data;
  }
}
