import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
})
export class DashboardComponent {
  todayRoutes: any[] = [];
  futureRoutes: any[] = [];
  vehicles: any[] = [];
  expenses: any[] = [];
  drivers: any[] = [];
  notifications: any[] = [];
  showNotifications = false;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.todayRoutes = this.dashboardService.getTodayRoutes();
    this.futureRoutes = this.dashboardService.getFutureRoutes();
   
    this.expenses = this.dashboardService.getExpenses();
    this.drivers = this.dashboardService.getDrivers();
    this.notifications = this.dashboardService.getNotifications();
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  get totalExpenses() {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

}
