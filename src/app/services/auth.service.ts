import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
   private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  sendSignupOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup/send-otp`, payload);
  }

  verifySignupOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup/verify-otp`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, payload);
  }

  forgotRequest(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password/request`, payload);
  }

  forgotVerify(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password/verify`, payload);
  }

  resendOtp(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/resend-otp`, payload);
  }

  me(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.baseUrl}/auth/me`, { headers });
  }

  changePassword(payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.baseUrl}/auth/change-password`, payload, { headers });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, { headers });
  }
}
