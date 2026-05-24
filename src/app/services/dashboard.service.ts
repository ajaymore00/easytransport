import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  getData(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`);
  }

  getDataById(url:string, id: string) {
    return this.http.get(`${this.baseUrl}/${url}/${id}`);
  }
 
  addData(url:string,vehicle: any) {
    return this.http.post(`${this.baseUrl}/${url}`, vehicle);
  }

  updateData(url:string, id: string, vehicle: any) {
    return this.http.put(`${this.baseUrl}/${url}/${id}`, vehicle);
  }

  deleteData(url:string, id: string) {
    return this.http.delete(`${this.baseUrl}/${url}/${id}`);
  }

  getTodayRoutes() {
    return [
      { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
      { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
      { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
      { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
      { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
      { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
      { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
      { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
      { id: 1, route: 'Pune → Mumbai', time: '08:00 AM', status: 'On the way' },
      { id: 2, route: 'Thane → Nashik', time: '09:30 AM', status: 'Pending' },
    ];
  }

  getFutureRoutes() {
    return [
      { id: 3, route: 'Mumbai → Nagpur', date: '2025-11-02' },
      { id: 4, route: 'Pune → Goa', date: '2025-11-05' },
    ];
  }

  // getVehicles() {
  //   return [
  //     { name: 'Tata Ace', type: 'Own', status: 'Active' },
  //     { name: 'Eicher 1100', type: 'Rented', status: 'On Route' },
  //   ];
  // }

  getExpenses() {
    return [
      { type: 'Fuel', amount: 3200, date: '2025-10-31' },
      { type: 'Toll', amount: 600, date: '2025-10-30' },
    ];
  }

  getDrivers() {
    return [
      { name: 'Rajesh Patil', contact: '9876543210' },
      { name: 'Amit More', contact: '9123456789' },
    ];
  }

  getNotifications() {
    return [
      { message: 'Vehicle Eicher 1100 reached Thane.', time: '10 min ago' },
      { message: 'New route added: Pune → Goa', time: '1 hr ago' },
    ];
  }
}
