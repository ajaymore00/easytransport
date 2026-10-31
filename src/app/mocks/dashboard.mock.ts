import { DashboardData } from '../models/dashboard.model';

export const DASHBOARD_MOCK_DATA: DashboardData = {
  todayRoutes: [
    { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
    { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
  ],
  futureRoutes: [
    { id: 3, route: 'Mumbai → Nagpur', date: '2026-11-02' },
    { id: 4, route: 'Pune → Goa', date: '2026-11-05' },
  ],
  vehicles: [
    { id: 1, name: 'Tata Ace', type: 'Own', status: 'Active' },
    { id: 2, name: 'Eicher 1100', type: 'Rented', status: 'On Route' },
  ],
  expenses: [
    { id: 1, type: 'Fuel', amount: 3200, date: '2026-10-31' },
    { id: 2, type: 'Toll', amount: 600, date: '2026-10-30' },
  ],
  drivers: [
    { id: 1, name: 'Rajesh Patil', contact: '9876543210' },
    { id: 2, name: 'Amit More', contact: '9123456789' },
  ],
};
