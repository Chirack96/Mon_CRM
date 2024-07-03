import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../services/user.service';
import { TrainingService } from '../services/training.service';
import { TaskService } from '../services/task.service';
import { UserLogService } from '../services/user-log.service';
import { User } from '../models/user.model';
import { Training } from '../models/training.model';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userService = inject(UserService);
  trainingService = inject(TrainingService);
  taskService = inject(TaskService);
  userLogService = inject(UserLogService);
  platformId = inject(PLATFORM_ID);
  user: User | null = null;
  trainings: Training[] = [];
  tasksAssigned: Task[] = [];
  errorMessage: string | null = null;
  lastLoginTime: Date | null = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserProfile().then(r => r).catch(e => e);
    } else {
      this.isLoading = false;
    }
  }

  async loadUserProfile(): Promise<void> {
    try {
      this.user = await this.userService.getUserProfile();
      if (this.user && this.user.id) {
        [this.trainings, this.tasksAssigned, this.lastLoginTime] = await Promise.all([
          this.trainingService.getUserTrainings(this.user.id),
          this.taskService.getTasksAssignedToUser(this.user.email),
          this.userLogService.getLastLoginTime(this.user.email)
        ]);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    } finally {
      this.isLoading = false;
    }
  }
}
