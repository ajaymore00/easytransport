import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  activeTrips = [
    {
      routeName: 'Pune to Mumbai',
      startLocation: 'Pune',
      endLocation: 'Mumbai',
      date: new Date(),
      time: '09:00 AM',
      driverName: 'Ramesh Pawar',
      vehicleNumber: 'MH12AB1234',
      status: 'In Transit',
      progress: 65,
      checkpoints: [
        { name: 'Pune', reached: true },
        { name: 'Lonavala', reached: true },
        { name: 'Panvel', reached: false },
        { name: 'Mumbai', reached: false },
      ],
    },{
      routeName: 'Pune to Bhiwandi',
      startLocation: 'Pune',
      endLocation: 'Bhiwandi',
      date: new Date(),
      time: '09:00 AM',
      driverName: 'Amitabh Tiwari',
      vehicleNumber: 'MH14CD4321',
      status: 'In Transit',
      progress: 65,
      checkpoints: [
        { name: 'Pune', reached: true }, 
        { name: 'Bhiwandi', reached: false },
      ],
    },
  ];

  refreshData() {
    console.log('Refreshing tracking data...');
  }

  viewMap(trip: any) {
    alert(`Opening map for ${trip.routeName}`);
  }
}