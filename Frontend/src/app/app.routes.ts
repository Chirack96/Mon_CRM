import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from "./customers/customers.component";
import { ReportsComponent } from "./reports/reports.component";
import { SettingsComponent } from "./settings/settings.component";
import { ProductsComponent } from "./products/products.component";
import { OrdersComponent } from "./orders/orders.component";
import { TicketsComponent } from "./tickets/tickets.components";
import { UsersComponent } from "./users/users.component";
import { AuthGuard } from "./auth.guard";
import { TaskComponent } from "./task/task.component";
import { UserLogsComponent } from "./user-logs/user-logs.component";
import { HumanResourcesComponent } from "./human-ressources/human-ressources.component";
import {ScheduleCalendarComponent} from "./schedule-calendar/schedule-calendar.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskComponent, canActivate: [AuthGuard] },
  { path: 'user-logs', component: UserLogsComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } }, // Supposons que nous ayons ajouté canActivate ici
  { path: 'human-resources', component: HumanResourcesComponent, canActivate: [AuthGuard] },
  {path: 'schedule-calendar', component: ScheduleCalendarComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: '', component: HomeComponent},
  { path: '**', redirectTo: '' }
];
