import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface ClientUser {
  clientName: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLoggedIn: Date;
  status: string;
}

@Component({
  selector: 'app-client-users-table',
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
  templateUrl: './client-users-table.component.html',
  styleUrls: ['./client-users-table.component.scss']
})
export class ClientUsersTableComponent implements OnInit {
  displayedColumns: string[] = ['clientName', 'firstName', 'lastName', 'email', 'lastLoggedIn', 'status'];
  dataSource = new MatTableDataSource<ClientUser>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = this.getMockClientData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getMockClientData(): ClientUser[] {
    return [
      {
        clientName: 'شركة نور للاستثمار والتطوير العقاري',
        firstName: 'ناصر',
        lastName: 'الشهراني',
        email: 'n.alshahrani@noor.com',
        lastLoggedIn: new Date('2025-06-07T07:00:00'),
        status: 'ACTIVE'
      },
      {
        clientName: 'شركة نور للاستثمار والتطوير العقاري',
        firstName: 'سامي',
        lastName: 'الغامدي',
        email: 'sami.alghamdi@noor.com.sa',
        lastLoggedIn: new Date('2025-06-07T06:45:00'),
        status: 'ACTIVE'
      },
      {
        clientName: 'شركة نور للاستثمار والتطوير العقاري',
        firstName: 'عمر',
        lastName: 'الشمالي',
        email: 'o.alshamali@noor.com',
        lastLoggedIn: new Date('2025-06-07T06:11:00'),
        status: 'ACTIVE'
      },
      {
        clientName: 'Requested Volume',
        firstName: 'Request',
        lastName: 'Volume',
        email: 'requestvolume@youmail.com',
        lastLoggedIn: new Date('2025-06-07T05:59:00'),
        status: 'ACTIVE'
      },
      {
        clientName: 'شركة مجموعة الأعمال الاستثمارية المتطورة',
        firstName: 'عبدالرحمن',
        lastName: 'راجحي',
        email: 'bajaaber@outlook.jp',
        lastLoggedIn: new Date('2025-03-07T12:46:00'),
        status: 'ACTIVE'
      },
      {
        clientName: 'شركة الخليج للعقارات',
        firstName: 'أحمد',
        lastName: 'رياض',
        email: 'ar.ragan@gulfproperties.com',
        lastLoggedIn: new Date('2025-03-07T07:42:00'),
        status: 'ACTIVE'
      }
    ];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}