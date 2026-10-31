import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { DashboardData, DashboardExpense } from '../models/dashboard.model';
import { DASHBOARD_MOCK_DATA } from '../mocks/dashboard.mock';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly today = new Date();
  todayRoutes: DashboardData['todayRoutes'] = environment.production ? [] : DASHBOARD_MOCK_DATA.todayRoutes;
  futureRoutes: DashboardData['futureRoutes'] = environment.production ? [] : DASHBOARD_MOCK_DATA.futureRoutes;
  vehicles: DashboardData['vehicles'] = environment.production ? [] : DASHBOARD_MOCK_DATA.vehicles;
  expenses: DashboardExpense[] = environment.production ? [] : DASHBOARD_MOCK_DATA.expenses;
  drivers: DashboardData['drivers'] = environment.production ? [] : DASHBOARD_MOCK_DATA.drivers;
  isLoading = false;
  hasError = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.todayRoutes = data.todayRoutes;
        this.futureRoutes = data.futureRoutes;
        this.vehicles = data.vehicles;
        this.expenses = data.expenses;
        this.drivers = data.drivers;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Failed to load dashboard data:', error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  get totalExpenses() {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  statusClass(status?: string): string {
    const value = status?.toLowerCase() ?? '';
    if (value.includes('inactive') || value.includes('complete')) {
      return 'dashboard-status--neutral';
    }
    if (value.includes('pending') || value.includes('route')) {
      return 'dashboard-status--warning';
    }
    if (value.includes('active') || value.includes('way') || value.includes('available')) {
      return 'dashboard-status--success';
    }
    return 'dashboard-status--info';
  }
}
