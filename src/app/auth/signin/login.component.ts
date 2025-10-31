import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      if (this.email && this.password) {
        localStorage.setItem('token', 'demo-token');
        this.router.navigate(['transport/dashboard']);
      } else {
        alert('Please enter valid credentials');
      }
    }, 1000);
  }
  routeTo(path: string) {
    console.log('Navigating to:', path);
    this.router.navigate([path]);
  } 
}
