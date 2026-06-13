import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [AuthService],
})
export class ForgotPasswordComponent {
  mobileNumber = '';
  otp = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  message = '';
  step: 1 | 2 = 1;
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private router: Router, private auth: AuthService) { }

  requestReset() {
    if (!this.mobileNumber) {
      alert('Please enter your mobile number');
      return;
    }
    this.isLoading = true;
    this.auth.forgotRequest({ mobileNumber: this.mobileNumber }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res?.message || 'OTP sent to your mobile.';
        if (res?.otp) alert(`OTP (dev): ${res.otp}`);
        this.step = 2;
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Request failed');
      }
    });
  }

  verifyReset() {
    if (!this.otp || !this.password || !this.confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;
    this.auth.forgotVerify({ mobileNumber: this.mobileNumber, otp: this.otp, password: this.password, confirmPassword: this.confirmPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert(res?.message || 'Password reset successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Verify failed');
        this.step = 1;
        this.otp = '';
      }
    });
  }

  resendOtp() {
    if (!this.mobileNumber) {
      alert('Please enter mobile number to resend OTP');
      return;
    }
    this.isLoading = true;
    this.auth.resendOtp({ mobileNumber: this.mobileNumber, purpose: 'forgot-password' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert(res?.message || 'OTP resent');
        if (res?.otp) alert(`OTP (dev): ${res.otp}`);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Resend failed');
      }
    });
  }

  routeTo(path: string) {
    this.router.navigate([path]);
  }
}
