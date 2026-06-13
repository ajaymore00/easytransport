import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent {
  mobileNumber = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(private router: Router, private auth: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.mobileNumber || !this.password) {
      alert('Please enter mobile number and password');
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
              this.router.navigate(['transport/dashboard']);
            },
            error: () => {
              // even if /me fails, navigate
              this.router.navigate(['transport/dashboard']);
            }
          });
        } else {
          alert('Login failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Login failed');
      }
    });
  }
  routeTo(path: string) {
    this.router.navigate([path]);
  }
}
