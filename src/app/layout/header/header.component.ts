import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();
  showNotifications = false;

  notifications = [
    { message: 'New vehicle added: Tata Ace MH12AB1234', time: '2 min ago' },
    { message: 'Route Pune → Goa scheduled for tomorrow', time: '1 hr ago' },
    { message: 'Driver Rajesh completed route Mumbai → Thane', time: '3 hrs ago' },
  ];
  constructor(private router: Router) {}
  toggleNotifications() { 
    this.showNotifications = !this.showNotifications;
  }
  clearNotifications(){
    this.notifications = [];
  }
    logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
