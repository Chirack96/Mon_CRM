import { Injectable } from '@angular/core';
import axios from 'axios';
import { Task, Comment, Attachment } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';
  private commentsUrl = 'http://localhost:8080/api/comments';
  private attachmentsUrl = 'http://localhost:8080/api/attachments';

  constructor() {}

  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(this.baseUrl, {
      withCredentials: true
    });
    return response.data;
  }

  async createTask(task: Task): Promise<Task> {
    const response = await axios.post<Task>(this.baseUrl, task, {
      withCredentials: true
    });
    return response.data;
  }

  async updateTask(id: number, task: Task): Promise<Task> {
    const response = await axios.put<Task>(`${this.baseUrl}/${id}`, task, {
      withCredentials: true
    });
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  async addComment(comment: Comment): Promise<Comment> {
    const response = await axios.post<Comment>(this.commentsUrl, comment, {
      withCredentials: true
    });
    return response.data;
  }

  async deleteComment(commentId: number): Promise<void> {
    await axios.delete(`${this.commentsUrl}/${commentId}`, {
      withCredentials: true
    });
  }

  async uploadAttachment(formData: FormData, taskId: number): Promise<Attachment> {
    const response = await axios.post<Attachment>(`${this.attachmentsUrl}?taskId=${taskId}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteAttachment(attachmentId: number): Promise<void> {
    await axios.delete(`${this.attachmentsUrl}/${attachmentId}`, {
      withCredentials: true
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

  async getTasksAssignedToUser(userEmail: string): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.assigneeEmail === userEmail);
    } catch (error) {
      console.error('Error fetching tasks assigned to user:', error);
      return [];
    }
  }

  async getTasksCreatedByUser(userEmail: string): Promise<Task[]> {
    try {
      const tasks = await this.getAllTasks();
      return tasks.filter(task => task.assignee === userEmail);
    } catch (error) {
      console.error('Error fetching tasks created by user:', error);
      return [];
    }
  }
}
