import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  mobileNumber = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private notifications: NotificationService,
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.mobileNumber || !this.password) {
      this.notifications.error('Please enter your mobile number and password.');
      return;
    }

    this.isLoading = true;
    this.auth.login({ mobileNumber: this.mobileNumber, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res?.token) {
          localStorage.setItem('token', res.token);
          // fetch current user
          this.auth.me().subscribe({
            next: (me) => {
              if (me?.user) {
                localStorage.setItem('user', JSON.stringify(me.user));
              }
              this.notifications.success('Logged in successfully.');
              this.router.navigate(['transport/dashboard']);
            },
            error: () => {
              // even if /me fails, navigate
              this.router.navigate(['transport/dashboard']);
            }
          });
        } else {
          this.notifications.error('Login failed. Please try again.');
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  routeTo(path: string) {
    this.router.navigate([path]);
  }
}
