import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [AuthService],
})
export class SignupComponent {
  transporterName = '';
  ownerName = '';
  whatsappNumber = '';
  email = '';
  gstNo = '';
  mobileNumber = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  otp = '';
  step: 1 | 2 = 1;
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor(private router: Router, private auth: AuthService) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      transporterName: this.transporterName,
      ownerName: this.ownerName,
      whatsappNumber: this.whatsappNumber,
      email: this.email,
      gstNo: this.gstNo,
      mobileNumber: this.mobileNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.isLoading = true;
    this.auth.sendSignupOtp(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert(res?.message || 'OTP sent to mobile number');
        if (res?.otp) alert(`OTP (dev): ${res.otp}`);
        this.step = 2;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Signup failed', err);
        alert(err?.error?.message || 'Signup failed');
      }
    });
  }

  verifyOtp() {
    if (!this.mobileNumber || !this.otp) {
      alert('Please enter mobile number and OTP');
      return;
    }
    this.isLoading = true;
    this.auth.verifySignupOtp({ mobileNumber: this.mobileNumber, otp: this.otp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert(res?.message || 'Verification successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error?.message || 'Verification failed');
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
    this.auth.resendOtp({ mobileNumber: this.mobileNumber, purpose: 'signup' }).subscribe({
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
