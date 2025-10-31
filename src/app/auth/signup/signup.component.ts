import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  constructor(private router: Router) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      alert('Account created successfully!');
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
     routeTo(path: string) {
    this.router.navigate([path]);
  } 
}
