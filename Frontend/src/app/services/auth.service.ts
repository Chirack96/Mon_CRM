import { Injectable } from '@angular/core';
import axios from 'axios';
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor() {}

  async login(email: string, password: string): Promise<User> {
    const response = await axios.post<User>(`${this.baseUrl}/login`, { email, password });
    return response.data;
  }

  async register(user: User): Promise<User> {
    const response = await axios.post<User>(`${this.baseUrl}/register`, user);
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${this.baseUrl}/logout`);
  }

  static isAuthenticated() {

  }
}
