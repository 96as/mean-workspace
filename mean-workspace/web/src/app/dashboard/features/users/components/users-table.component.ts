import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from '../user.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, OnChanges {
  @Input() users: User[] = [];
  @Input() page = 1;
  @Input() limit = 10;
  @Input() filter = '';
  @Input() total = 0;

  @Output() filterChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  displayedColumns: string[] = ['organizationName', 'firstName', 'lastName', 'email', 'lastLoggedIn', 'status', 'organization'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users']) {
      this.updateDataSource();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Don't set paginator here since we're handling pagination externally
  }

  private updateDataSource() {
    this.dataSource.data = this.users;
  }

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterChange.emit(filterValue);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event.pageIndex + 1); // Convert to 1-based indexing
    
    // Only emit limitChange if page size actually changed
    if (event.pageSize !== this.limit) {
      this.limitChange.emit(event.pageSize);
    }
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'PENDING':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  getOrganizationClass(organization: string): string {
    return organization === 'vendor' ? 'org-vendor' : 'org-client';
  }
}