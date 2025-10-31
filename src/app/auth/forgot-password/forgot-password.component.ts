import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  message = '';

  constructor(private router: Router) { }

  resetPassword() {
    if (!this.email) {
      alert('Please enter your email');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.message = 'A password reset link has been sent to your email.';
    }, 1000);
  }
    routeTo(path: string) {
    this.router.navigate([path]);
  } 
}
