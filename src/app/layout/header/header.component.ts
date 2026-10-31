import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { ConfirmationService } from '../../services/confirmation.service';
@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  transporterName = 'Transporter account';
  ownerName = '';

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const user: { transporterName?: unknown; ownerName?: unknown } = JSON.parse(storedUser);
      if (typeof user.transporterName === 'string' && user.transporterName.trim()) {
        this.transporterName = user.transporterName.trim();
      }
      if (typeof user.ownerName === 'string') {
        this.ownerName = user.ownerName.trim();
      }
    } catch (error) {
      console.error('Unable to read the stored user profile:', error);
    }
  }

  get userInitials(): string {
    return this.transporterName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  constructor(
    private router: Router,
    private confirmation: ConfirmationService,
  ) {}

  logout() {
    this.confirmation.confirm('Log out?', 'Are you sure you want to log out?', 'Log out', true)
      .subscribe((confirmed) => {
        if (!confirmed) return;
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  }
}
