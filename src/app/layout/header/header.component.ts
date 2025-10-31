import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  toggleNotifications() { 
    this.showNotifications = !this.showNotifications;
  }
  clearNotifications(){
    this.notifications = [];
  }
}
