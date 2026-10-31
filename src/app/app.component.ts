import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sidebarOpen = true;
  isSmallScreen = false;

  constructor(
    readonly loading: LoadingService,
    readonly notifications: NotificationService,
  ) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024; // Tailwind 'lg'
    if (this.isSmallScreen) this.sidebarOpen = false;
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

   
 
}
