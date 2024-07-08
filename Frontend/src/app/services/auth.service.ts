import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import axios, { AxiosError } from 'axios';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';




  private authStatusSource = new BehaviorSubject<boolean>(false);
  public authStatus = this.authStatusSource.asObservable();

  private isLoadingSource = new BehaviorSubject<boolean>(true);
  public isLoading = this.isLoadingSource.asObservable();

  private userRoleSource = new BehaviorSubject<string>('');
  public userRole = this.userRoleSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLoginState().then(r => console.log('Login state initialized'));
  }

  public async initializeLoginState() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        await this.checkAuth();
        await this.updateUserRole();
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification', this.getErrorMessage(error));
      } finally {
        this.isLoadingSource.next(false);
      }
    }
  }

  private async checkAuth() {
    try {
      const response = await axios.get(`${this.baseUrl}/check-auth`, { withCredentials: true });
      if (response.data.authenticated) {
        this.authStatusSource.next(true);
        console.log('User is authenticated');
      } else {
        this.authStatusSource.next(false);
        console.log('User is not authenticated')
      }
    } catch (error) {
      this.authStatusSource.next(false);
      if (this.isAxiosError(error) && error.response && error.response.status !== 401) {
        console.error('Erreur lors de la vérification de l\'authentification', this.getErrorMessage(error));
      }
    }
  }

  public async register(user: User): Promise<{ userId: number } | null> {
    this.isLoadingSource.next(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/register`, user, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Registration failed', this.getErrorMessage(error));
      throw this.getErrorMessage(error); // Propager l'erreur pour qu'elle soit gérée dans le composant
    } finally {
      this.isLoadingSource.next(false);
    }
  }

  public async login(email: string, password: string): Promise<{ userId: number } | null> {
    this.isLoadingSource.next(true);
    try {
      const response = await axios.post<{ userId: number }>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
      if (response.data.userId) {
        this.authStatusSource.next(false); // User is logged in but not verified yet
        return response.data;
      } else {
        console.error('User ID is missing in the response');
        return null;
      }
    } catch (error) {
      console.error('Login failed', this.getErrorMessage(error));
      this.authStatusSource.next(false);
      return null;
    } finally {
      this.isLoadingSource.next(false);
    }
  }

  public async verifyCode(userId: number, code: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/verify-code`, { userId, code }, { withCredentials: true });
      this.authStatusSource.next(true);
      return true;
    } catch (error) {
      console.error('Verification failed', this.getErrorMessage(error));
      this.authStatusSource.next(false);
      return false;
    }
  }

  public async logout(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoadingSource.next(true);
      try {
        await axios.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
        this.authStatusSource.next(false);
      } catch (error) {
        console.error('Logout failed', this.getErrorMessage(error));
      } finally {
        this.isLoadingSource.next(false);
      }
    }
  }

  public setAuthStatus(status: boolean): void {
    this.authStatusSource.next(status);
  }

  private isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }
  public async updateUserRole(): Promise<void> {
    const role = await this.getUserRole();
    this.userRoleSource.next(role);
  }

  private getErrorMessage(error: unknown): string {
    if (this.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string }; // Typage de la réponse d'erreur
      const errorMessage = responseData?.message || error.message || 'Unknown error';
      return `Error: ${error.response?.status} - ${errorMessage}`;
    }
    return 'An unknown error occurred';
  }

  public async getUserRole(): Promise<string> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const response = await axios.get<{ id: number, name: string, authority: string }[]>(`${this.baseUrl}/user-role`, { withCredentials: true });
        console.log('API Response:', response.data); // Vérifiez la réponse de l'API
        if (response.data && response.data.length > 0) {
          const userRole = response.data[0].name; // Assurez-vous que cela correspond à la structure de votre réponse
          console.log('User role:', userRole);
          return userRole;
        } else {
          console.log('No roles found for the user.');
          return '';
        }
      } catch (error) {
        console.error('Failed to get user role', this.getErrorMessage(error));
        return '';
      }
    }
    return '';
  }
}
