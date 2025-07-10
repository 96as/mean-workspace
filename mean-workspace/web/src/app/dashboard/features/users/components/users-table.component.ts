import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { User } from '../user.component';


@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    CardModule
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  @Input() users: User[] = [];
  @Input() page = 1;
  @Input() limit = 10;
  @Input() filter = '';
  @Input() total = 0;
  @Input() loading = false;

  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() filterChange = new EventEmitter<string>();

  columns = [
    { field: 'organizationName', header: 'Organization Name' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'lastLoggedIn', header: 'Last Logged In' },
    { field: 'status', header: 'Status' },
    { field: 'organization', header: 'Type' }
  ];

  onLazyLoad(event: TableLazyLoadEvent) {
    this.lazyLoad.emit(event);
  }

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterChange.emit(filterValue);
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      case 'PENDING':
        return 'warning';
      default:
        return 'info';
    }
  }

  getOrganizationSeverity(organization: string): 'info' | 'secondary' {
    return organization === 'vendor' ? 'info' : 'secondary';
  }


}