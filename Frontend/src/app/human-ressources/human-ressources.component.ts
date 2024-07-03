import { Component } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ScheduleCalendarComponent } from '../schedule-calendar/schedule-calendar.component';
import { PerformanceDashboardComponent } from '../performance-dashboard/performance-dashboard.component';
import { UsersComponent } from '../users/users.component';
import { HRReportsComponent } from '../hr-reports/hr-reports.component';
import { PayrollManagementComponent } from '../payroll-management/payroll-management.component';
import {TrainingComponent} from "../training/training.component";

@Component({
  selector: 'app-human-ressources',
  standalone: true,
  imports: [
    NgSwitch,
    ScheduleCalendarComponent,
    TrainingComponent,
    NgSwitchCase,
    UsersComponent,
    PerformanceDashboardComponent,
    HRReportsComponent,
    PayrollManagementComponent
  ],
  templateUrl: './human-ressources.component.html',
  styleUrls: ['./human-ressources.component.scss']
})
export class HumanResourcesComponent {
  activeTab: string = 'profiles';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
