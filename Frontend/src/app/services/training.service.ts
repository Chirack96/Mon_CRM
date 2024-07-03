import { Injectable } from '@angular/core';
import { Training } from '../models/training.model';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private baseUrl = 'http://localhost:8080/api/trainings';

  async getTrainings(): Promise<Training[]> {
    try {
      const response = await axios.get<Training[]>(this.baseUrl, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings', error);
      throw error;
    }
  }

  async getTraining(id: number): Promise<Training> {
    try {
      const response = await axios.get<Training>(`${this.baseUrl}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching training', error);
      throw error;
    }
  }

  async createTraining(training: Training): Promise<Training> {
    try {
      const response = await axios.post<Training>(this.baseUrl, training, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error creating training', error);
      throw error;
    }
  }

  async updateTraining(id: number, training: Training): Promise<Training> {
    try {
      const response = await axios.put<Training>(`${this.baseUrl}/${id}`, training, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error updating training', error);
      throw error;
    }
  }

  async deleteTraining(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
    } catch (error) {
      console.error('Error deleting training', error);
      throw error;
    }
  }

  async toggleEnrollment(trainingId: number, userId: number): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${trainingId}/toggle-enrollment`, null, {
        params: { userId },
        withCredentials: true,
      });
      console.log('Enrollment toggled');
    } catch (error) {
      console.error('Error toggling enrollment', error);
      throw error;
    }
  }

  async getUserTrainings(userId: number): Promise<Training[]> {
    try {
      const response = await axios.get<Training[]>(`${this.baseUrl}/user/${userId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Error fetching user trainings', error);
      throw error;
    }
  }
}
