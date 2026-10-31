import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { DashboardData } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient, private notifications: NotificationService) { }

  getData(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`);
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  getDataById(url:string, id: string) {
    return this.http.get(`${this.baseUrl}/${url}/${id}`);
  }
 
  addData(url:string,vehicle: any) {
    return this.http.post(`${this.baseUrl}/${url}`, vehicle).pipe(
      tap(() => this.notifications.success(this.getResourceLabel(url) + ' created successfully.')),
    );
  }

  updateData(url:string, id: string, vehicle: any) {
    return this.http.put(`${this.baseUrl}/${url}/${id}`, vehicle).pipe(
      tap(() => this.notifications.success(this.getResourceLabel(url) + ' updated successfully.')),
    );
  }

  deleteData(url:string, id: string) {
    return this.http.delete(`${this.baseUrl}/${url}/${id}`).pipe(
      tap(() => this.notifications.success(this.getResourceLabel(url) + ' deleted successfully.')),
    );
  }

  private getResourceLabel(resource: string): string {
    const labels: Record<string, string> = {
      drivers: 'Driver',
      expenses: 'Expense',
      routes: 'Route',
      vehicles: 'Vehicle',
    };

    return labels[resource] || 'Record';
  }

}
