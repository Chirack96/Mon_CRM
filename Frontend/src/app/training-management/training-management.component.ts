import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-training-management',
  templateUrl: './training-management.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./training-management.component.scss']
})
export class TrainingManagementComponent {
  trainings = [
    { id: 1, title: 'Leadership 101', description: 'Apprenez les bases du leadership.' },
    { id: 2, title: 'Gestion du temps', description: 'Techniques pour gérer efficacement votre temps.' }
  ];

  constructor() { }

  enroll(trainingId: number): void {
    // Logic to enroll in a course
    console.log(`Enrolled in training ${trainingId}`);
  }
}
