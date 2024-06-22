import { Component } from '@angular/core';
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {ScheduleCalendarComponent} from "../schedule-calendar/schedule-calendar.component";
import {TrainingManagementComponent} from "../training-management/training-management.component";
import {PerformanceDashboardComponent} from "../performance-dashboard/performance-dashboard.component";
import {UsersComponent} from "../users/users.component";
import {HRReportsComponent} from "../hr-reports/hr-reports.component";

@Component({
  selector: 'app-human-ressources',
  standalone: true,
  imports: [
    NgSwitch,
    ScheduleCalendarComponent,
    TrainingManagementComponent,
    NgSwitchCase,
    UsersComponent,
    PerformanceDashboardComponent,
    HRReportsComponent
  ],
  templateUrl: './human-ressources.component.html',
  styleUrl: './human-ressources.component.scss'
})
export class HumanResourcesComponent {
  activeTab: string = 'profiles';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
