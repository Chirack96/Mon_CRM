import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Assurez-vous que jwt-decode est installé et importé correctement
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private verificationKey = 'verification_completed';

  // BehaviorSubjects pour maintenir l'état actuel de l'authentification et du chargement
  private authStatusSource = new BehaviorSubject<boolean>(false);
  public authStatus = this.authStatusSource.asObservable();

  private isLoadingSource = new BehaviorSubject<boolean>(false);
  public isLoading = this.isLoadingSource.asObservable();

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
        this.authStatusSource.next(verificationCompleted);
      } else {
        this.authStatusSource.next(false);
      }
      this.isLoadingSource.next(false);
    }
  }

  async register(user: User): Promise<{ userId: number } | null> {
    this.isLoadingSource.next(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/register`, user);
      return response.data;
    } catch (error) {
      console.error('Registration failed', error);
      return null;
    } finally {
      this.isLoadingSource.next(false);
    }
  }

  async login(email: string, password: string): Promise<{ userId: number } | null> {
    this.isLoadingSource.next(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/login`, { email, password });
      if (response.data.userId) {
        localStorage.setItem(this.userIdKey, response.data.userId.toString());
        this.authStatusSource.next(false); // User is logged in but not verified yet
        return response.data;
      } else {
        console.error('User ID is missing in the response');
        return null;
      }
    } catch (error) {
      console.error('Login failed', error);
      this.authStatusSource.next(false);
      return null;
    } finally {
      this.isLoadingSource.next(false);
    }
  }

  async verifyCode(userId: number, code: string): Promise<{ token: string } | null> {
    try {
      const response = await axios.post<{ token: string }>(`${this.baseUrl}/verify-code`, { userId, code });
      this.storeToken(response.data.token);
      this.authStatusSource.next(true);
      return response.data;
    } catch (error) {
      console.error('Verification failed', error);
      this.authStatusSource.next(false);
      return null;
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
      localStorage.removeItem(`${this.verificationKey}_${this.getUserId()}`);
      this.authStatusSource.next(false);
    }
  }

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem(`${this.verificationKey}_${decodedToken.userId}`, 'true');
      this.authStatusSource.next(true);
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

  setAuthStatus(status: boolean): void {
    this.authStatusSource.next(status);
  }

  getAuthHeaders() {
    const token = this.getToken();
    console.log('JWT Token sent with request:', token);
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
