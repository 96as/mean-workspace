import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartDataInput } from './components/status-donut-chart.component';
import { VendorUsersTableComponent } from './components/vendor-users-table.component';
import { ClientUsersTableComponent } from './components/client-users-table.component';
import { StatusDonutChartComponent } from './components/status-donut-chart.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    VendorUsersTableComponent,
    ClientUsersTableComponent,
    StatusDonutChartComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  vendorStatusData: ChartDataInput = {
    title: 'NHC Vendors\' Users per Status',
    data: [5, 1, 1],
    labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
    total: 7
  };

  clientStatusData: ChartDataInput = {
    title: 'NHC Clients\' Users per Status',
    data: [5,0,0],
    labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
    total: 5
  };
}