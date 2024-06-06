import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {CustomersComponent} from "./customers/customers.component";
import {ReportsComponent} from "./reports/reports.component";
import {SettingsComponent} from "./settings/settings.component";
import {ProductsComponent} from "./products/products.component";
import {OrdersComponent} from "./orders/orders.component";
import {TicketsComponent} from "./tickets/tickets.components";
import {UsersComponent} from "./users/users.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'dashboard' , component: DashboardComponent},
      {path: 'customers' , component: CustomersComponent},
      {path: 'reports' , component: ReportsComponent},
      {path: 'settings' , component: SettingsComponent},
      {path: 'products' , component: ProductsComponent},
      {path: 'orders' , component: OrdersComponent},
      {path: 'tickets' , component: TicketsComponent},
      {path: 'users' , component: UsersComponent},
  {path: 'homes' , component: HomeComponent},
      { path: 'home', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },



];
