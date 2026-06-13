import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardService } from '../services/dashboard.service'; 
import {MatTimepickerModule} from '@angular/material/timepicker';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTimepickerModule
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
  providers: [DashboardService],
})
export class RouteComponent implements OnInit {
  @ViewChild('routeDialog') routeDialog!: TemplateRef<any>;

  routes: any[] = [];

  routeForm: FormGroup;
  editMode = false;
  editingRouteId: number | null = null;
  checkpointInput = '';

  drivers: string[] = [];
  vehicles: string[] = [];

  cargoTypes = ['Food Grains', 'Electronics', 'Machinery', 'Textiles', 'Pharma', 'Frozen Goods'];

  statuses = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];

  constructor(private dialog: MatDialog, private fb: FormBuilder, private dashboardService: DashboardService) {
    this.routeForm = this.buildRouteForm();
  }

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
    this.loadRoutes();
  }

  normalizeRoute(route: any) {
    return {
      ...route,
      id: route._id || route.id,
      routeNo: route.routeNo || route.routeNo || '',
      routeName: route.routeName || route.name || '',
      driverName: route.driverName || route.driver || '',
      vehicleNumber: route.vehicleNumber || route.vehicle || '',
      checkpoints: Array.isArray(route.checkpoints)
        ? route.checkpoints.map((cp: any) =>
            typeof cp === 'string'
              ? { name: cp, reached: false }
              : {
                  name: cp.name || cp.title || '',
                  reached: cp.reached ?? false,
                  driverStatus: cp.driverStatus || '',
                  updatedOn: cp.updatedOn || '',
                  remarks: cp.remarks || '',
                }
          )
        : [],
    };
  }

  loadRoutes() {
    this.dashboardService.getData('routes').subscribe({
      next: (data: any[]) => {
        this.routes = Array.isArray(data) ? data.map((route) => this.normalizeRoute(route)) : [];
      },
      error: (error) => {
        console.error('Unable to load routes:', error);
      },
    });
  }

  loadDrivers() {
    this.dashboardService.getData('drivers').subscribe({
      next: (data: any[]) => {
        this.drivers = Array.isArray(data)
          ? data.map((driver) => driver.name || driver.driverName || `${driver.firstName || ''} ${driver.lastName || ''}`.trim())
          : [];
      },
      error: (error) => {
        console.error('Unable to load drivers:', error);
      },
    });
  }

  loadVehicles() {
    this.dashboardService.getData('vehicles').subscribe({
      next: (data: any[]) => {
        this.vehicles = Array.isArray(data)
          ? data.map((vehicle) => vehicle.name || vehicle.vehicleNumber || vehicle.registrationNo || '')
          : [];
      },
      error: (error) => {
        console.error('Unable to load vehicles:', error);
      },
    });
  }

  buildRouteForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      vendor: ['', [Validators.required, Validators.maxLength(100)]],
      startLocation: ['', [Validators.required, Validators.maxLength(60)]],
      endLocation: ['', [Validators.required, Validators.maxLength(60)]],
      driver: ['', Validators.required],
      vehicle: ['', Validators.required],
      cargoType: ['', Validators.required],
      loadWeight: ['', [Validators.required, Validators.maxLength(30)]],
      distanceKm: [0, [Validators.required, Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(1)]],
      status: ['Pending', Validators.required],
      shipmentReference: ['', Validators.maxLength(40)],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      checkpoints: [[]],
      notes: ['', Validators.maxLength(300)],
    });
  }

  openForm(route?: any) {
    this.editMode = !!route;
    this.editingRouteId = route ? route.id : null;

    // Handle both old format (routeName, driverName) and new format (name, driver)
    const routeName = route?.name || route?.routeName || '';
    const driver = route?.driver || route?.driverName || '';
    const vehicle = route?.vehicle || route?.vehicleNumber || '';

    this.routeForm.reset({
      name: routeName,
      vendor: route?.vendor || '',
      startLocation: route?.startLocation || '',
      endLocation: route?.endLocation || '',
      driver: driver,
      vehicle: vehicle,
      cargoType: route?.cargoType || '',
      loadWeight: route?.loadWeight || '',
      distanceKm: route?.distanceKm || 0,
      amount: route?.amount || 0,
      status: route?.status || 'Pending',
      shipmentReference: route?.shipmentReference || '',
      startDate: route?.startDate || route?.date || '',
      startTime: route?.startTime  || '',
      endTime: route?.endTime || '',
      checkpoints: route?.checkpoints ? (Array.isArray(route.checkpoints) && typeof route.checkpoints[0] === 'string' ? route.checkpoints : route.checkpoints.map((c: any) => c.name || c)) : [],
      notes: route?.notes || '',
    });
    this.checkpointInput = '';
    this.dialog.open(this.routeDialog, {
      width: '90%',
      maxWidth: '900px',
      panelClass: 'route-dialog-panel',
    });
  }

  closeForm() {
    this.dialog.closeAll();
  }

  addCheckpoint() {
    const value = this.checkpointInput?.trim();
    if (!value) {
      return;
    }
    const checkpoints = this.routeForm.get('checkpoints')?.value || [];
    this.routeForm.get('checkpoints')?.setValue([...checkpoints, value]);
    this.checkpointInput = '';
  }

  addCheckpointFromTemplate(inputRef: any) {
    const value = inputRef?.value?.trim();
    if (!value) {
      return;
    }
    const checkpoints = this.routeForm.get('checkpoints')?.value || [];
    this.routeForm.get('checkpoints')?.setValue([...checkpoints, value]);
    inputRef.value = '';
  }

  removeCheckpoint(index: number) {
    const checkpoints: string[] = this.routeForm.get('checkpoints')?.value || [];
    checkpoints.splice(index, 1);
    this.routeForm.get('checkpoints')?.setValue(checkpoints);
  }

  saveRoute() {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      return;
    }

    const formValue = this.routeForm.value;
    const payload = {
      routeName: formValue.name,
      startLocation: formValue.startLocation,
      endLocation: formValue.endLocation,
      date: formValue.startDate ? new Date(formValue.startDate) : new Date(),
      startTime: formValue.startTime || '09:00 AM',
      endTime: formValue.endTime || '05:00 PM',
      driverName: formValue.driver,
      vehicleNumber: formValue.vehicle,
      status: formValue.status,
      progress: this.editMode ? this.routes.find((r) => r.id === this.editingRouteId)?.progress ?? 0 : 0,
      checkpoints: (formValue.checkpoints || []).map((cp: string) => ({ name: cp, reached: false })),
      createdDate: new Date(),
      updatedDate: new Date(),
      createdOn: new Date(),
      updatedOn: new Date(),
      vendor: formValue.vendor,
      cargoType: formValue.cargoType,
      loadWeight: formValue.loadWeight,
      distanceKm: formValue.distanceKm,
      amount: formValue.amount,
      shipmentReference: formValue.shipmentReference,
      notes: formValue.notes,
    };

    if (this.editMode && this.editingRouteId) {
      this.dashboardService.updateData('routes', this.editingRouteId.toString(), payload).subscribe({
        next: (updatedRoute: any) => {
          const normalized = this.normalizeRoute(updatedRoute);
          const index = this.routes.findIndex((r) => r.id === normalized.id);
          if (index > -1) {
            this.routes[index] = normalized;
          } else {
            this.routes.unshift(normalized);
          }
          this.closeForm();
        },
        error: (error) => {
          console.error('Failed to update route:', error);
        },
      });
    } else {
      this.dashboardService.addData('routes', payload).subscribe({
        next: (createdRoute: any) => {
          this.routes.unshift(this.normalizeRoute(createdRoute));
          this.closeForm();
        },
        error: (error) => {
          console.error('Failed to create route:', error);
        },
      });
    }
  }

  deleteRoute(id: any) {
    const routeId = id?.toString();
    this.dashboardService.deleteData('routes', routeId).subscribe({
      next: () => {
        this.routes = this.routes.filter((r) => r.id !== routeId && r.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete route:', error);
      },
    });
  }

  getControl(name: string) {
    return this.routeForm.get(name);
  }
  viewMap(trip: any) {
    alert(`Opening map for ${trip.routeName}`);
  }
}
