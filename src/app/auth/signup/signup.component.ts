import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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

  constructor(
    private router: Router,
    private auth: AuthService,
    private notifications: NotificationService,
  ) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      this.notifications.error('Passwords do not match.');
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
        this.notifications.success(res?.message || 'OTP sent to mobile number.');
        if (res?.otp) alert(`OTP (dev): ${res.otp}`);
        this.step = 2;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  verifyOtp() {
    if (!this.mobileNumber || !this.otp) {
      this.notifications.error('Please enter your mobile number and OTP.');
      return;
    }
    this.isLoading = true;
    this.auth.verifySignupOtp({ mobileNumber: this.mobileNumber, otp: this.otp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notifications.success(res?.message || 'Verification successful.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.isLoading = false;
        this.step = 1;
        this.otp = '';
      }
    });
  }

  resendOtp() {
    if (!this.mobileNumber) {
      this.notifications.error('Please enter your mobile number to resend OTP.');
      return;
    }
    this.isLoading = true;
    this.auth.resendOtp({ mobileNumber: this.mobileNumber, purpose: 'signup' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notifications.success(res?.message || 'OTP resent.');
        if (res?.otp) alert(`OTP (dev): ${res.otp}`);
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
