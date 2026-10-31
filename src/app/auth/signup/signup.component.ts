import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { isValidMobileNumber } from '../auth-validation';

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

  signup(form: NgForm) {
    form.form.markAllAsTouched();

    const transporterName = this.transporterName.trim();
    const ownerName = this.ownerName.trim();

    if (transporterName.length < 2 || ownerName.length < 2) {
      this.notifications.error('Company and contact names must be at least 2 characters.');
      return;
    }

    if (!isValidMobileNumber(this.mobileNumber)) {
      this.notifications.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (this.whatsappNumber && !isValidMobileNumber(this.whatsappNumber)) {
      this.notifications.error('WhatsApp number must contain exactly 10 digits.');
      return;
    }

    if (form.invalid) {
      this.notifications.error('Please correct the highlighted fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notifications.error('Passwords do not match.');
      return;
    }

    const payload = {
      transporterName,
      ownerName,
      whatsappNumber: this.whatsappNumber.trim(),
      email: this.email.trim(),
      gstNo: this.gstNo.trim().toUpperCase(),
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
    if (!isValidMobileNumber(this.mobileNumber)) {
      this.notifications.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!this.otp) {
      this.notifications.error('Please enter the OTP.');
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
    if (!isValidMobileNumber(this.mobileNumber)) {
      this.notifications.error('Please enter a valid 10-digit mobile number to resend OTP.');
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
