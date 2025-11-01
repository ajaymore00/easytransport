import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './driver.component.html'
})
export class DriverComponent {
  drivers = [
    {
      name: 'Ramesh Pawar',
      licenseNo: 'MH-14-2023-5678',
      contact: '9876543210',
      experience: 5,
      address: 'Pune, Maharashtra',
      dateAdded: new Date(),
      status: 'Available',
    },
  ];

  showForm = false;
  editingDriver: any = null;
  driverForm: any = {
    name: '',
    licenseNo: '',
    contact: '',
    experience: '',
    address: '',
    status: 'Available',
  };

  openForm() {
    this.editingDriver = null;
    this.driverForm = {
      name: '',
      licenseNo: '',
      contact: '',
      experience: '',
      address: '',
      status: 'Available',
    };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  saveDriver() {
    if (this.editingDriver) {
      Object.assign(this.editingDriver, this.driverForm);
    } else {
      this.drivers.push({ ...this.driverForm, dateAdded: new Date() });
    }
    this.closeForm();
  }

  editDriver(driver: any) {
    this.editingDriver = driver;
    this.driverForm = { ...driver };
    this.showForm = true;
  }

  deleteDriver(driver: any) {
    this.drivers = this.drivers.filter((d) => d !== driver);
  }

  callDriver(contact: string) {
    window.location.href = `tel:${contact}`;
  }

  whatsappDriver(contact: string) {
    window.open(`https://wa.me/91${contact}`, '_blank');
  }
}
