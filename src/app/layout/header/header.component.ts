import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../services/confirmation.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface EditableProfile {
  transporterName: string;
  ownerName: string;
  email: string;
  mobileNumber: string;
  whatsappNumber: string;
  gstNo: string;
}

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  transporterName = 'Transporter account';
  ownerName = '';
  profile: EditableProfile = this.emptyProfile();
  isEditingProfile = false;
  isSavingProfile = false;

  ngOnInit(): void {
    this.loadStoredProfile();
    this.auth.me().subscribe({
      next: (response) => {
        const user = response?.user ?? response?.data?.user ?? response?.data ?? response;
        if (!user || typeof user !== 'object') {
          this.notifications.error('Unable to load your profile. Please try again.');
          return;
        }

        const updatedUser = { ...this.readStoredUser(), ...user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.setProfile(updatedUser);
      },
      error: () => {
        this.notifications.error('Unable to load your profile. Please try again.');
      },
    });
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
    private auth: AuthService,
    private notifications: NotificationService,
  ) {}

  openProfileEditor(): void {
    this.isEditingProfile = true;
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false;
    this.loadStoredProfile();
  }

  saveProfile(): void {
    if (this.isSavingProfile) return;

    this.isSavingProfile = true;
    this.auth.updateProfile(this.profile).subscribe({
      next: (response) => {
        const storedUser = this.readStoredUser();
        const responseUser = response?.user ?? response?.data?.user;
        const updatedUser = {
          ...storedUser,
          ...this.profile,
          ...(responseUser && typeof responseUser === 'object' ? responseUser : {}),
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.setProfile(updatedUser);
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.notifications.success('Profile updated successfully.');
      },
      error: () => {
        this.isSavingProfile = false;
        this.notifications.error('Unable to update your profile. Please try again.');
      },
    });
  }

  private loadStoredProfile(): void {
    this.setProfile(this.readStoredUser());
  }

  private readStoredUser(): Partial<EditableProfile> {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return {};

    try {
      return JSON.parse(storedUser) as Partial<EditableProfile>;
    } catch (error) {
      console.error('Unable to read the stored user profile:', error);
      return {};
    }
  }

  private setProfile(user: Partial<EditableProfile>): void {
    this.profile = {
      transporterName: user.transporterName || '',
      ownerName: user.ownerName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      whatsappNumber: user.whatsappNumber || '',
      gstNo: user.gstNo || '',
    };
    this.transporterName = this.profile.transporterName.trim() || 'Transporter account';
    this.ownerName = this.profile.ownerName.trim();
  }

  private emptyProfile(): EditableProfile {
    return {
      transporterName: '',
      ownerName: '',
      email: '',
      mobileNumber: '',
      whatsappNumber: '',
      gstNo: '',
    };
  }

  logout() {
    this.confirmation.confirm('Log out?', 'Are you sure you want to log out?', 'Log out', true)
      .subscribe((confirmed) => {
        if (!confirmed) return;
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  }
}
