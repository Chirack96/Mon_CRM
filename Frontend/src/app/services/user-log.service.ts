import { Injectable } from '@angular/core';
import { UserLog } from '../models/user-log.model';
import axios from "axios";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})

export class UserLogService {
  private baseUrl = 'http://localhost:8080/api/user-logs';

  constructor(private authService: AuthService) {}

  async getUserLogs(): Promise<UserLog[]> {
    const response  = await axios.get<UserLog[]>(`${this.baseUrl}`, {
    headers: this.authService.getAuthHeaders()
  });
    return response.data;
  }
}
