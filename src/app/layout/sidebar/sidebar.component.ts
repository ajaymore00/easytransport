import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() closeRequested = new EventEmitter<void>();
  @Input() isOpen = true;

  readonly currentYear = new Date().getFullYear();
  readonly navigationItems = [
    { label: 'Dashboard', route: '/transport/dashboard', icon: '⌂', exact: true },
    { label: 'Trips', route: '/transport/routes', icon: '↗', exact: false },
    { label: 'Vehicles', route: '/transport/vehicles', icon: '▰', exact: false },
    { label: 'Expenses', route: '/transport/expenses', icon: '₹', exact: false },
    { label: 'Drivers', route: '/transport/drivers', icon: '♙', exact: false },
    { label: 'Reports', route: '/transport/reports', icon: '▤', exact: false },
  ];
}
