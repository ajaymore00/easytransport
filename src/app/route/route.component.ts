import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ConfirmationService } from '../services/confirmation.service';
import { NotificationService } from '../services/notification.service';

interface RouteCheckpoint {
  name: string;
  reached: boolean;
  driverStatus?: string;
  updatedOn?: string;
  remarks?: string;
}

interface RouteRecord {
  id: string | number;
  routeName?: string;
  status?: string;
  startLocation?: string;
  endLocation?: string;
  date?: string | Date;
  startTime?: string | Date;
  endTime?: string | Date;
  driverName?: string;
  vehicleNumber?: string;
  progress?: number;
  checkpoints: RouteCheckpoint[];
  amount?: number;
  fuelCost?: number;
  tollCost?: number;
  driverCost?: number;
  otherCost?: number;
  statusUpdating?: boolean;
  checkpointUpdating?: boolean;
}

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
})
export class RouteComponent implements OnInit {
  @ViewChild('routeDialog') routeDialog!: TemplateRef<any>;

  routes: RouteRecord[] = [];

  routeForm: FormGroup;
  editMode = false;
  editingRouteId: string | number | null = null;
  checkpointInput = '';

  drivers: string[] = [];
  vehicles: string[] = [];

  cargoTypes = ['Food Grains', 'Electronics', 'Machinery', 'Textiles', 'Pharma', 'Frozen Goods'];

  statuses = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private confirmation: ConfirmationService,
    private notifications: NotificationService,
  ) {
    this.routeForm = this.buildRouteForm();
  }

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
    this.loadRoutes();
  }

  normalizeRoute(route: any): RouteRecord {
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
      fuelCost: [0, [Validators.min(0)]],
      tollCost: [0, [Validators.min(0)]],
      driverCost: [0, [Validators.min(0)]],
      otherCost: [0, [Validators.min(0)]],
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
      fuelCost: route?.fuelCost || 0,
      tollCost: route?.tollCost || 0,
      driverCost: route?.driverCost || 0,
      otherCost: route?.otherCost || 0,
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
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
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

  private buildCheckpoints(names: string[]): RouteCheckpoint[] {
    const existing = this.routes.find((route) => route.id === this.editingRouteId)?.checkpoints || [];
    const checkpointsByName = new Map<string, RouteCheckpoint[]>();

    for (const checkpoint of existing) {
      const key = checkpoint.name.trim().toLocaleLowerCase();
      const matches = checkpointsByName.get(key) || [];
      matches.push(checkpoint);
      checkpointsByName.set(key, matches);
    }

    return names.map((name) => {
      const trimmedName = name.trim();
      const matches = checkpointsByName.get(trimmedName.toLocaleLowerCase());
      const checkpoint = matches?.shift();
      return checkpoint
        ? { ...checkpoint, name: trimmedName }
        : { name: trimmedName, reached: false, driverStatus: 'Pending' };
    });
  }

  checkpointProgress(checkpoints: RouteCheckpoint[]): number {
    if (!checkpoints.length) return 0;
    const reached = this.completedCheckpointCount(checkpoints);
    return Math.round((reached / checkpoints.length) * 100);
  }

  tripProgress(route: RouteRecord): number {
    return this.progressFor(route.status, route.checkpoints, route.progress);
  }

  private progressFor(statusValue: string | undefined, checkpoints: RouteCheckpoint[], previousProgress?: number): number {
    const status = statusValue?.toLowerCase();
    if (status === 'delivered') return 100;
    if (status === 'in transit') {
      const journeySteps = checkpoints.length + 2;
      const completedSteps = 1 + this.completedCheckpointCount(checkpoints);
      return Math.round((completedSteps / journeySteps) * 100);
    }
    if (status === 'pending') return 0;
    return Math.max(0, Math.min(100, this.money(previousProgress)));
  }

  completedCheckpointCount(checkpoints: RouteCheckpoint[]): number {
    return checkpoints.filter((checkpoint) => checkpoint.reached).length;
  }

  toggleCheckpoint(route: RouteRecord, checkpoint: RouteCheckpoint): void {
    if (route.status?.toLowerCase() !== 'in transit') return;
    if (route.checkpointUpdating) return;

    const id = String(route.id);
    if (!id || id === 'undefined') {
      this.notifications.error('Unable to update checkpoint: trip ID is missing.');
      return;
    }

    const reached = !checkpoint.reached;
    const checkpoints = route.checkpoints.map((item) =>
      item === checkpoint
        ? {
            ...item,
            reached,
            driverStatus: reached ? 'Reached' : 'Pending',
            updatedOn: new Date().toISOString(),
          }
        : { ...item },
    );
    const payload = {
      ...route,
      checkpoints,
      progress: this.tripProgress({ ...route, checkpoints }),
    };

    route.checkpointUpdating = true;
    this.dashboardService.updateData('routes', id, payload).subscribe({
      next: (updatedRoute: any) => {
        const normalized = this.normalizeRoute({
          ...payload,
          ...updatedRoute,
          _id: updatedRoute?._id ?? route.id,
        });
        normalized.checkpointUpdating = false;
        const index = this.routes.findIndex((item) => String(item.id) === id);
        if (index !== -1) this.routes[index] = normalized;
      },
      error: (error) => {
        console.error('Failed to update trip checkpoint:', error);
        route.checkpointUpdating = false;
        this.notifications.error('Unable to update checkpoint. Please try again.');
      },
    });
  }

  saveRoute() {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      return;
    }

    if (this.routeForm.get('status')?.value === 'Delivered') {
      const checkpoints = this.buildCheckpoints(this.routeForm.get('checkpoints')?.value || []);
      const incompleteCount = checkpoints.filter((checkpoint) => !checkpoint.reached).length;
      if (incompleteCount > 0) {
        this.notifications.error(
          `Complete all checkpoints before delivery. ${incompleteCount} checkpoint${incompleteCount === 1 ? '' : 's'} remaining.`,
        );
        return;
      }
    }

    const action = this.editMode ? 'update' : 'create';
    this.confirmation.confirm(
      `${action === 'update' ? 'Update' : 'Create'} route?`,
      `Are you sure you want to ${action} this route?`,
      action === 'update' ? 'Update route' : 'Create route',
    ).subscribe((confirmed) => {
      if (confirmed) this.persistRoute();
    });
  }

  private persistRoute() {
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
      progress: 0,
      checkpoints: this.buildCheckpoints(formValue.checkpoints || []),
      createdDate: new Date(),
      updatedDate: new Date(),
      createdOn: new Date(),
      updatedOn: new Date(),
      vendor: formValue.vendor,
      cargoType: formValue.cargoType,
      loadWeight: formValue.loadWeight,
      distanceKm: formValue.distanceKm,
      amount: formValue.amount,
      fuelCost: Number(formValue.fuelCost) || 0,
      tollCost: Number(formValue.tollCost) || 0,
      driverCost: Number(formValue.driverCost) || 0,
      otherCost: Number(formValue.otherCost) || 0,
      shipmentReference: formValue.shipmentReference,
      notes: formValue.notes,
    };
    payload.progress = this.progressFor(
      payload.status,
      payload.checkpoints,
      this.editMode ? this.routes.find((route) => route.id === this.editingRouteId)?.progress : 0,
    );

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
    if (!routeId) return;

    this.confirmation.confirm('Delete route?', 'Are you sure you want to delete this route?', 'Delete route', true)
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.dashboardService.deleteData('routes', routeId).subscribe({
          next: () => {
            this.routes = this.routes.filter((r) => r.id !== routeId && r.id !== id);
          },
          error: (error) => {
            console.error('Failed to delete route:', error);
          },
        });
    });
  }

  getControl(name: string) {
    return this.routeForm.get(name);
  }

  get totalRevenue(): number {
    return this.activeRoutes.reduce((sum, route) => sum + this.money(route.amount), 0);
  }

  get totalTripCosts(): number {
    return this.activeRoutes.reduce((sum, route) => sum + this.tripCost(route), 0);
  }

  get estimatedProfit(): number {
    return this.totalRevenue - this.totalTripCosts;
  }

  get activeRoutes(): RouteRecord[] {
    return this.routes.filter((route) => route.status?.toLowerCase() !== 'cancelled');
  }

  tripCost(route: RouteRecord): number {
    return this.money(route.fuelCost) + this.money(route.tollCost) +
      this.money(route.driverCost) + this.money(route.otherCost);
  }

  tripProfit(route: RouteRecord): number {
    return this.money(route.amount) - this.tripCost(route);
  }

  private money(value: unknown): number {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : 0;
  }

  canAdvanceStatus(route: RouteRecord): boolean {
    const status = route.status?.toLowerCase();
    return status === 'pending' || status === 'in transit';
  }

  statusActionLabel(route: RouteRecord): string {
    return route.status?.toLowerCase() === 'in transit' ? 'Mark delivered' : 'Start trip';
  }

  advanceStatus(route: RouteRecord): void {
    if (!this.canAdvanceStatus(route) || route.statusUpdating) return;
    const delivered = route.status?.toLowerCase() === 'in transit';

    if (delivered) {
      const incompleteCount = route.checkpoints.filter((checkpoint) => !checkpoint.reached).length;
      if (incompleteCount > 0) {
        this.notifications.error(
          `Complete all checkpoints before delivery. ${incompleteCount} checkpoint${incompleteCount === 1 ? '' : 's'} remaining.`,
        );
        return;
      }
    }

    const id = String(route.id);
    if (!id || id === 'undefined') return;

    const payload = {
      ...route,
      routeName: route.routeName || '',
      driverName: route.driverName || '',
      vehicleNumber: route.vehicleNumber || '',
      status: delivered ? 'Delivered' : 'In Transit',
      progress: delivered ? 100 : this.tripProgress({ ...route, status: 'In Transit' }),
      updatedDate: new Date(),
      updatedOn: new Date(),
    };

    route.statusUpdating = true;
    this.dashboardService.updateData('routes', id, payload).subscribe({
      next: (updatedRoute: any) => {
        const normalized = this.normalizeRoute({
          ...payload,
          ...updatedRoute,
          _id: updatedRoute?._id ?? route.id,
        });
        const index = this.routes.findIndex((item) => String(item.id) === id);
        if (index !== -1) {
          normalized.statusUpdating = false;
          this.routes[index] = normalized;
        }
      },
      error: (error) => {
        console.error('Failed to update trip status:', error);
        this.notifications.error('Unable to update trip status. Please try again.');
        route.statusUpdating = false;
      },
    });
  }

  statusClass(status?: string): string {
    const value = status?.toLowerCase() ?? '';
    if (value.includes('delivered') || value.includes('active')) {
      return 'management-card__status--success';
    }
    if (value.includes('pending') || value.includes('transit')) {
      return 'management-card__status--warning';
    }
    if (value.includes('cancel')) {
      return 'management-card__status--neutral';
    }
    return 'management-card__status--info';
  }

  viewMap(trip: any) {
    alert(`Opening map for ${trip.routeName}`);
  }
}
