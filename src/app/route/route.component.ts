import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Route {
  id: number;
  name: string;
  startLocation: string;
  endLocation: string;
  driver: string;
  vehicle: string;
  vendor: string;
  startDate: string;
  startTime: string;
  endTime: string;
  checkpoints: string[];
  notes: string;
}

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route.component.html',
})
export class RouteComponent {
  routes: Route[] = [];
  showForm = false;
  editMode = false;
  checkpointInput = '';
  formData: Route = this.getEmptyForm();
vehicles:any=[]
drivers:any=[]
  getEmptyForm(): Route {
    return {
      id: 0,
      name: '',
      startLocation: '',
      endLocation: '',
      driver: '',
      vehicle: '',
      vendor: '',
      startDate: '',
      startTime: '',
      endTime: '',
      checkpoints: [],
      notes: ''
    };
  }

  openForm(route?: Route) {
    this.showForm = true;
    this.editMode = !!route;
    this.formData = route ? { ...route } : this.getEmptyForm();
  }

  closeForm() {
    this.showForm = false;
  }

  addCheckpoint() {
    if (this.checkpointInput.trim()) {
      this.formData.checkpoints.push(this.checkpointInput.trim());
      this.checkpointInput = '';
    }
  }

  removeCheckpoint(i: number) {
    this.formData.checkpoints.splice(i, 1);
  }

  saveRoute() {
    if (this.editMode) {
      const i = this.routes.findIndex(r => r.id === this.formData.id);
      this.routes[i] = { ...this.formData };
    } else {
      this.formData.id = Date.now();
      this.routes.push({ ...this.formData });
    }
    this.closeForm();
  }

  deleteRoute(id: number) {
    this.routes = this.routes.filter(r => r.id !== id);
  }
}
