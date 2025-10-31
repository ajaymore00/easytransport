 

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
   imports: [CommonModule, RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
  vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Tata Ace',
      model: '2020',
      registrationNo: 'MH-12-AB-1234',
      type: 'Own',
      driverName: 'Ramesh',
      driverContact: '9876543210',
      status: 'Active',
      dateAdded: new Date(),
    },
    {
      id: 2,
      name: 'Eicher 1100',
      model: '2022',
      registrationNo: 'MH-14-CD-4321',
      type: 'Rented',
      driverName: 'Suresh',
      driverContact: '9876501234',
      status: 'On Route',
      dateAdded: new Date(),
    },
  ];

  showForm = false;
  editingVehicle: Vehicle | null = null;
  vehicleForm: Partial<Vehicle> = {};

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
