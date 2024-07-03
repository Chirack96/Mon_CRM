import { Injectable } from '@angular/core';
import { UserLog } from '../models/user-log.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UserLogService {
  private baseUrl = 'http://localhost:8080/api/user-logs';

  constructor() {}

  async getUserLogs(): Promise<UserLog[]> {
    const response = await axios.get<UserLog[]>(`${this.baseUrl}`, {
      withCredentials: true
    });
    return response.data;
  }

  async getUserLogsByEmail(userEmail: string): Promise<UserLog[]> {
    const response = await axios.get<UserLog[]>(`${this.baseUrl}?email=${userEmail}`, {
      withCredentials: true
    });
    console.log('User logs:', response.data);
    return response.data;
  }

  async getLastLoginTime(userEmail: string): Promise<Date | null> {
    try {
      const logs = await this.getUserLogsByEmail(userEmail);
      if (logs.length > 0) {
        return new Date(logs[logs.length - 1].loginTime);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return null;
    }
  }
}
