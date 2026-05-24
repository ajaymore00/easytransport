 

import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
interface Vehicle {
  _id?: string;
  id?: number;
  name: string;
  manufacturer: string;
  model: string;
  registrationNo: string;
  type: 'Own' | 'Rented';
  year: string;
  color: string;
  capacity: string;
  mileage: string;
  insuranceExpiry: string | Date;
  status: string;
  dateAdded: Date;
}

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [DashboardService],
})
export class VehicleComponent implements OnInit {
  @ViewChild('vehicleDialog') vehicleDialog!: TemplateRef<any>;

  vehicles: Vehicle[] = [];

  dashboardService = inject(DashboardService);
  dialog = inject(MatDialog);
  editingVehicle: Vehicle | null = null;
  vehicleForm: Partial<Vehicle> = {};

  manufacturers = [
    'Tata',
    'Ashok Leyland',
    'Mahindra',
    'Volvo',
    'Mercedes-Benz',
    'Hyundai',
    'Toyota',
    'Ford',
    'Isuzu',
    'Scania'
  ];

  vehicleYears = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => `${2000 + i}`).reverse();

  ngOnInit() {
    this.fetchVehicles();
  }

  fetchVehicles() {
    this.dashboardService.getData('vehicles').subscribe({
      next: (data: any) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error fetching vehicles:', error);
      },
    });
  }

  openForm(vehicle?: Vehicle) {
    this.editingVehicle = vehicle || null;
    this.vehicleForm = vehicle ? { ...vehicle } : {};
    this.dialog.open(this.vehicleDialog, {
      width: '720px',
      panelClass: 'vehicle-dialog-panel',
    });
  }

  editVehicle(vehicle: Vehicle) {
    this.openForm(vehicle);
  }

  closeForm() {
    this.dialog.closeAll();
  }

  private getVehicleId(vehicle: Vehicle) {
    return vehicle._id || (vehicle.id ? vehicle.id.toString() : undefined);
  }

  saveVehicle() {
    const payload = {
      ...this.vehicleForm,
      status: this.vehicleForm.status || 'Active',
      dateAdded: this.vehicleForm.dateAdded || new Date().toISOString(),
    };

    if (this.editingVehicle) {
      const id = this.getVehicleId(this.editingVehicle);
      if (!id) {
        console.error('Unable to update vehicle: missing id');
        return;
      }
      this.dashboardService.updateData('vehicles', id, payload).subscribe({
        next: (updated: any) => {
          const index = this.vehicles.findIndex((v) => this.getVehicleId(v) === id);
          if (index !== -1) {
            this.vehicles[index] = updated;
          }
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating vehicle:', error);
        },
      });
    } else {
      this.dashboardService.addData('vehicles', payload).subscribe({
        next: (saved: any) => {
          this.vehicles.push(saved);
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating vehicle:', error);
        },
      });
    }
  }

  deleteVehicle(vehicle: Vehicle) {
    const id = this.getVehicleId(vehicle);
    if (!id) return;

    this.dashboardService.deleteData('vehicles', id).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter((v) => this.getVehicleId(v) !== id);
      },
      error: (error) => {
        console.error('Error deleting vehicle:', error);
      },
    });
  }
}
