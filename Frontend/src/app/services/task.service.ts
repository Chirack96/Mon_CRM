import { Injectable } from '@angular/core';
import axios from 'axios';
import { Task, Comment, Attachment } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';
  private commentsUrl = 'http://localhost:8080/api/comments';
  private attachmentsUrl = 'http://localhost:8080/api/attachments';

  constructor(private authService: AuthService) {}

  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async createTask(task: Task): Promise<Task> {
    const response = await axios.post<Task>(this.baseUrl, task, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async updateTask(id: number, task: Task): Promise<Task> {
    const response = await axios.put<Task>(`${this.baseUrl}/${id}`, task, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  async addComment(comment: Comment): Promise<Comment> {
    const response = await axios.post<Comment>(this.commentsUrl, comment, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async deleteComment(commentId: number): Promise<void> {
    await axios.delete(`${this.commentsUrl}/${commentId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  async uploadAttachment(formData: FormData, taskId: number): Promise<Attachment> {
    const response = await axios.post<Attachment>(`${this.attachmentsUrl}?taskId=${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...this.authService.getAuthHeaders()
      }
    });
    return response.data;
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    await axios.delete(`${this.attachmentsUrl}/${attachmentId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.status === status);
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      return [];
    }
  }

}
