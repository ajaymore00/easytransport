import { Component, ViewChild, TemplateRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../services/dashboard.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService } from '../services/confirmation.service';
@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
     MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './driver.component.html',
})
export class DriverComponent implements OnInit {
  drivers: any[] = [];

  @ViewChild('driverDialog') driverDialog!: TemplateRef<any>;
  dashboardService = inject(DashboardService);
  private confirmation = inject(ConfirmationService);
  editingDriver: any = null;
  driverForm: any = {
    name: '',
    licenseNo: '',
    contact: '',
    experience: '',
    salary: '',
    joiningDate: '',
    address: '',
    status: 'Available',
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers() {
    this.dashboardService.getData('drivers').subscribe({
      next: (data: any) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
      },
    });
  }

  openForm() {
    this.editingDriver = null;
    this.driverForm = {
      name: '',
      licenseNo: '',
      contact: '',
      experience: '',
      salary: '',
      joiningDate: '',
      address: '',
      status: 'Available',
    };

    const ref = this.dialog.open(this.driverDialog, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const payload = { ...result, dateAdded: new Date() };
        this.dashboardService.addData('drivers', payload).subscribe({
          next: (created) => this.drivers.push(created),
          error: (err) => console.error('Create failed', err),
        });
      }
    });
  }

  closeForm() {
    // kept for compatibility if referenced elsewhere
  }

  confirmSaveDriver(form: NgForm, dialogRef: MatDialogRef<unknown>) {
    if (form.invalid) return;

    const action = this.editingDriver ? 'update' : 'create';
    this.confirmation.confirm(
      `${action === 'update' ? 'Update' : 'Create'} driver?`,
      `Are you sure you want to ${action} this driver?`,
      action === 'update' ? 'Update driver' : 'Create driver',
    ).subscribe((confirmed) => {
      if (confirmed) dialogRef.close(form.value);
    });
  }

  editDriver(driver: any) {
    this.editingDriver = driver;
    this.driverForm = { ...driver };

    const ref = this.dialog.open(this.driverDialog, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.dashboardService.updateData('drivers', driver._id || driver.id, result).subscribe({
          next: (updated) => Object.assign(driver, updated),
          error: (err) => console.error('Update failed', err),
        });
      }
    });
  }

  deleteDriver(driver: any) {
    this.confirmation.confirm('Delete driver?', 'Are you sure you want to delete this driver?', 'Delete driver', true)
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const id = driver._id || driver.id;
        if (!id) {
          this.drivers = this.drivers.filter((d) => d !== driver);
          return;
        }

        this.dashboardService.deleteData('drivers', id).subscribe({
          next: () => (this.drivers = this.drivers.filter((d) => d !== driver)),
          error: (err) => console.error('Delete failed', err),
        });
    });
  }

  callDriver(contact: string) {
    window.location.href = `tel:${contact}`;
  }

  whatsappDriver(contact: string) {
    window.open(`https://wa.me/91${contact}`, '_blank');
  }
}
