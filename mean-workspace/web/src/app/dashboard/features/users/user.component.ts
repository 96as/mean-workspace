import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ChartDataInput } from './components/status-donut-chart.component';
import { UsersTableComponent } from './components/users-table.component';
import { StatusDonutChartComponent } from './components/status-donut-chart.component';
import { UserService } from './services/user.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

export interface User {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLoggedIn: Date;
  status: string;
  organization: 'client' | 'vendor';
}

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    UsersTableComponent,
    StatusDonutChartComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // Table data
  users: User[] = [];
  totalUsers = 0;
  loading = false;
  
  // Pagination and filtering
  currentPage = 1;
  pageSize = 10;
  currentFilter = '';
  private filterSubject = new Subject<string>();
  
  // Chart data and toggle state
  isVendorView = true; // Toggle state: true for vendor, false for client
  
  vendorStatusData: ChartDataInput = {
    title: 'Vendor Users Status',
    data: [],
    labels: [],
    total: 0
  };
  
  clientStatusData: ChartDataInput = {
    title: 'Client Users Status', 
    data: [],
    labels: [],
    total: 0
  };
  
  // Current chart data based on toggle
  get currentChartData(): ChartDataInput {
    return this.isVendorView ? this.vendorStatusData : this.clientStatusData;
  }
  
  constructor(private userService: UserService) {
    // Setup debounced filter
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filter => {
      this.currentFilter = filter;
      this.currentPage = 1;
      this.loadUsers();
    });
  }
  
  ngOnInit() {
    this.loadUsers();
    this.loadChartData();
  }
  
  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize, this.currentFilter)
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.totalUsers = response.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        }
      });
  }
  
  loadChartData() {
    this.userService.getUserStats().subscribe({
      next: (stats) => {
        this.vendorStatusData = {
          title: 'Vendor Users Status',
          data: [stats.vendorStats.active, stats.vendorStats.pending, stats.vendorStats.inactive],
          labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
          total: stats.vendorStats.total
        };
        
        this.clientStatusData = {
          title: 'Client Users Status',
          data: [stats.clientStats.active, stats.clientStats.pending, stats.clientStats.inactive],
          labels: ['ACTIVE', 'PENDING', 'INACTIVE'],
          total: stats.clientStats.total
        };
      }
    });
  }
  

  
  // Event handlers
  onFilterChange(filter: string) {
    this.filterSubject.next(filter);
  }
  
  onLazyLoad(event: any) {
    // Handle PrimeNG table lazy load event
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    
    // Handle sorting if provided
    if (event.sortField) {
      // Add sorting logic here if needed
    }
    
    this.loadUsers();
  }
  
  // Toggle between vendor and client view
  toggleChartView() {
    this.isVendorView = !this.isVendorView;
  }
  
  onChartLegendClick(event: {label: string, value: number, index: number}) {
    // Filter table based on current view (vendor or client) and status
    const organizationType = this.isVendorView ? 'vendor' : 'client';
    this.currentFilter = `${organizationType} ${event.label.toLowerCase()}`;
    this.currentPage = 1;
    this.loadUsers();
  }
}