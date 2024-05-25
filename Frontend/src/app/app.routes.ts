import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {CustomersComponent} from "./customers/customers.component";
import {ReportsComponent} from "./reports/reports.component";
import {SettingsComponent} from "./settings/settings.component";
import {ProductsComponent} from "./products/products.component";
import {OrdersComponent} from "./orders/orders.component";
import {TicketsComponent} from "./tickets/tickets.components";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'dashboard' , component: DashboardComponent},
      {path: 'customers' , component: CustomersComponent},
      {path: 'reports' , component: ReportsComponent},
      {path: 'settings' , component: SettingsComponent},
      {path: 'products' , component: ProductsComponent},
      {path: 'orders' , component: OrdersComponent},
      {path: 'tickets' , component: TicketsComponent},

    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },


];
