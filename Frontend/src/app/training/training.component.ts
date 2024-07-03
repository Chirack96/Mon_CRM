import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../services/training.service';
import { Training } from '../models/training.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  trainings: Training[] = [];
  userId!: number;
  buttonText: { [key: number]: string } = {};

  constructor(private trainingService: TrainingService, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.userService.getUserProfile();
      if (user && user.id) {
        this.userId = user.id;
        await this.loadTrainings();
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  }

  async loadTrainings(): Promise<void> {
    try {
      this.trainings = await this.trainingService.getTrainings();
      const userTrainings = await this.trainingService.getUserTrainings(this.userId);

      this.trainings.forEach(training => {
        const isEnrolled = userTrainings.some(ut => ut.id === training.id);
        training.users = isEnrolled ? [{ id: this.userId } as User] : [];
        this.updateButtonText(training);
      });
      console.log('Trainings loaded');
      console.log(this.trainings);
    } catch (error) {
      console.error('Error loading trainings', error);
    }
  }

  async toggleEnrollment(trainingId: number): Promise<void> {
    try {
      await this.trainingService.toggleEnrollment(trainingId, this.userId);
      const training = this.trainings.find(t => t.id === trainingId);
      if (training) {
        if (!training.users) {
          training.users = [];
        }
        if (this.isUserEnrolled(training.users)) {
          training.users = training.users.filter(user => user.id !== this.userId);
        } else {
          training.users.push({ id: this.userId } as User);
        }
        this.updateButtonText(training);
      }
    } catch (error) {
      console.error('Error toggling enrollment', error);
    }
  }

  isNew(date: Date): boolean {
    const currentDate = new Date();
    const trainingDate = new Date(date);
    const diffDays = Math.ceil((currentDate.getTime() - trainingDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }

  isUserEnrolled(users: User[] | undefined): boolean {
    if (!users) {
      return false;
    }
    return users.some(user => user.id === this.userId);
  }

  updateButtonText(training: Training): void {
    this.buttonText[training.id] = this.isUserEnrolled(training.users) ? 'Se désinscrire' : 'S\'inscrire';
  }
}
