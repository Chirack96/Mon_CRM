import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import { User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  authStatus = signal(false);  // Expose the signal as public
  isLoading = signal(true);    // New signal for loading state

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkInitialLoginState();
  }

  checkInitialLoginState() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token && this.isTokenValid(token)) {
        this.authStatus.set(true);
      } else {
        this.authStatus.set(false);
      }
      this.isLoading.set(false);  // Set loading to false after checking the initial state
    }
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    this.isLoading.set(true);
    try {
      const response = await axios.post<{ token: string }>(`${this.baseUrl}/login`, { email, password });
      if (response.data.token) {
        this.storeToken(response.data.token);
        this.authStatus.set(true);
        return response.data;
      } else {
        throw new Error('Token is missing in the response');
      }
    } catch (error) {
      console.error('Login failed', error);
      this.authStatus.set(false);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(user: User): Promise<{ token: string }> {
    this.isLoading.set(true);
    try {
      const response = await axios.post<{ token: string }>(`${this.baseUrl}/register`, user);
      if (response.data.token) {
        this.storeToken(response.data.token);
        this.authStatus.set(true);
        return response.data;
      } else {
        throw new Error('Token is missing in the response');
      }
    } catch (error) {
      console.error('Registration failed', error);
      this.authStatus.set(false);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.authStatus.set(false);
  }

  private storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
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
}
