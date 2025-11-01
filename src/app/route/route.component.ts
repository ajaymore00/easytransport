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
  routes: Route[] = [{
    "id": 1762021876724,
    "name": "MUMBAI TO PUNE",
    "startLocation": "MUMBAI",
    "endLocation": "PUNE",
    "driver": "Ramesh Pawar",
    "vehicle": "Super Carrier",
    "vendor": "TANNA AGRO IMPEX PVT LTD (DL)",
    "startDate": "2025-11-02",
    "startTime": "02:00",
    "endTime": "05:00",
    "checkpoints": [
        "KHOPOLI",
        "PANVEL"
    ],
    "notes": "test"
},{
    "id": 1762021876723,
    "name": "MUMBAI TO BENGALURU",
    "startLocation": "MUMBAI",
    "endLocation": "BENGALURU",
    "driver": "Amitabh Tiwari",
    "vehicle": "Mahindra Bolero",
    "vendor": "DELHI TRADERS (DL)",
    "startDate": "2025-11-02",
    "startTime": "02:00",
    "endTime": "05:00",
    "checkpoints": [
        "KARNATAKA" 
    ],
    "notes": "test"
}];
  showForm = false;
  editMode = false;
  checkpointInput = '';
  formData: Route = this.getEmptyForm();
vehicles:any=[{name:'Super Carrier'},{name:'Tata Ace'},{name:'Eicher 1100'},{name:'Mahindra Bolero'},{name:'Ashok Leyland Dost'}    ]
drivers:any=[{name:'Ramesh Pawar'},{name:'Suresh Kumar'},{name:'Mahesh Singh'},{name:'Vikram Joshi'},{name:'Amitabh Tiwari'}      ]
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
    console.log(this.formData);
    this.closeForm();
  }

  deleteRoute(id: number) {
    this.routes = this.routes.filter(r => r.id !== id);
  }
}
