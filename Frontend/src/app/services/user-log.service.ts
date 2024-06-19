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
}
