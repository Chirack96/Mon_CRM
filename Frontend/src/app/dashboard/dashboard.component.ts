import { Component } from '@angular/core';
import {NgClass, NgSwitch, NgSwitchCase} from '@angular/common';
import { SaleOverviewComponent } from '../sale-overview/sale-overview.component';
import { ReportsComponent } from '../reports/reports.component';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    SaleOverviewComponent,
    ReportsComponent,
    UsersComponent,
    NgClass
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  activeTab: string = 'sales';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
