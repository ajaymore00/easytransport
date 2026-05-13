 

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
interface Vehicle {
  id: number;
  name: string;
  model: string;
  registrationNo: string;
  type: 'Own' | 'Rented';
  driverName: string;
  driverContact: string;
  status: string;
  dateAdded: Date;
}

@Component({
  selector: 'app-vehicle',
  standalone: true,
   imports: [CommonModule, RouterModule,ReactiveFormsModule,FormsModule,HttpClientModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [DashboardService],
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];

  dashboardService = inject(DashboardService);  
  showForm = false;
  editingVehicle: Vehicle | null = null;
  vehicleForm: Partial<Vehicle> = {};

  ngOnInit() {
    console.log('Fetching vehicles from API...');
     this.dashboardService.getVehicles().subscribe((data: any) => {
      this.vehicles = data; 
    });
  }
  openForm() {
    this.showForm = true;
    this.editingVehicle = null;
    this.vehicleForm = {};
  }

  editVehicle(vehicle: Vehicle) {
    this.showForm = true;
    this.editingVehicle = vehicle;
    this.vehicleForm = { ...vehicle };
  }

  closeForm() {
    this.showForm = false;
  }

  saveVehicle() {
    if (this.editingVehicle) {
      Object.assign(this.editingVehicle, this.vehicleForm);
    } else {
      const newVehicle: Vehicle = {
        id: Date.now(),
        name: this.vehicleForm.name || '',
        model: this.vehicleForm.model || '',
        registrationNo: this.vehicleForm.registrationNo || '',
        type: this.vehicleForm.type as 'Own' | 'Rented',
        driverName: this.vehicleForm.driverName || '',
        driverContact: this.vehicleForm.driverContact || '',
        status: this.vehicleForm.status || 'Active',
        dateAdded: new Date(),
      };
      this.vehicles.push(newVehicle);
    }
    this.showForm = false;
  }

  deleteVehicle(vehicle: Vehicle) {
    this.vehicles = this.vehicles.filter((v) => v.id !== vehicle.id);
  }
}
