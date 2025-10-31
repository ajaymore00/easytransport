import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 import { HeaderComponent } from '../header/header.component';  
 import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,HeaderComponent,SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
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
