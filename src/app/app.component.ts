import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sidebarOpen = true;


  isSmallScreen = false;

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
