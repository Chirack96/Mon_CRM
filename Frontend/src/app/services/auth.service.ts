import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private verificationKey = 'verification_completed';
  authStatus = signal(false);
  isLoading = signal(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkInitialLoginState();
  }

  checkInitialLoginState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token && this.isTokenValid(token)) {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;
        const verificationCompleted = localStorage.getItem(`${this.verificationKey}_${userId}`) === 'true';

        if (verificationCompleted) {
          this.authStatus.set(true);
        } else {
          this.authStatus.set(false);
        }
      } else {
        this.authStatus.set(false);
      }
      this.isLoading.set(false);
    }
  }

  async register(user: User): Promise<{ userId: number }> {
    this.isLoading.set(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/register`, user);
      return response.data;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<{ userId: number }> {
    this.isLoading.set(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/login`, { email, password });
      if (response.data.userId) {
        localStorage.setItem(this.userIdKey, response.data.userId.toString());
        this.authStatus.set(false); // User is not fully authenticated yet
        return response.data;
      } else {
        throw new Error('User ID is missing in the response');
      }
    } catch (error) {
      console.error('Login failed', error);
      this.authStatus.set(false);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async verifyCode(userId: number, code: string): Promise<{ token: string }> {
    const response = await axios.post<{ token: string }>(`${this.baseUrl}/verify-code`, { userId, code });
    return response.data;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
      localStorage.removeItem(`${this.verificationKey}_${this.getUserId()}`);
    }
    this.authStatus.set(false);
  }

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem(`${this.verificationKey}_${decodedToken.userId}`, 'true');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.userIdKey);
    }
    return null;
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      return Date.now() < expirationTime;
    } catch (e) {
      console.error('Token validation failed:', e);
      return false;
    }
  }

  getAuthHeaders() {
    const token = this.getToken();
    console.log('JWT Token sent with request:', token);
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
