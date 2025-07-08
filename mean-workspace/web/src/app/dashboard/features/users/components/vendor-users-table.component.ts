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

export interface VendorUser {
  vendorName: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLoggedIn: Date;
  status: string;
}

@Component({
  selector: 'app-vendor-users-table',
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
  templateUrl: './vendor-users-table.component.html',
  styleUrls: ['./vendor-users-table.component.scss']
})
export class VendorUsersTableComponent implements OnInit {
  displayedColumns: string[] = ['vendorName', 'firstName', 'lastName', 'email', 'lastLoggedIn', 'status'];
  dataSource = new MatTableDataSource<VendorUser>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = this.getMockVendorData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getMockVendorData(): VendorUser[] {
    return [
      {
        vendorName: 'شركة الخليج للتجارة والاستثمار والتنمية',
        firstName: 'خالد',
        lastName: 'الشمري',
        email: 'khalid@gulf-trading.com.sa',
        lastLoggedIn: new Date('2025-06-07T09:18:00'),
        status: 'ACTIVE'
      },
      {
        vendorName: 'شركة الشرق الأوسط للتجارة والتنمية الاقتصادية',
        firstName: 'أحمد',
        lastName: 'الجابري',
        email: 'ahmed@middle-east-trading.com.sa',
        lastLoggedIn: new Date('2025-06-07T08:34:00'),
        status: 'INACTIVE'
      },
      {
        vendorName: 'شركة الرياض للتجارة والصناعة',
        firstName: 'طارق',
        lastName: 'العوض',
        email: 'tariq@riyadh-trading.com.sa',
        lastLoggedIn: new Date('2025-06-07T07:48:00'),
        status: 'ACTIVE'
      },
      {
        vendorName: 'شركة مكاتب للتنمية والاستثمار العقاري والتجاري',
        firstName: 'محمد',
        lastName: 'مرتكار',
        email: 'mohammed@maktab-real-estate.com',
        lastLoggedIn: new Date('2025-06-07T06:59:00'),
        status: 'pending'
      },
      {
        vendorName: 'شركة أبراج الخليج للتنمية والاستثمار',
        firstName: 'أحمد',
        lastName: 'علي أحمد محمود',
        email: 'ahmed@gulf-towers.com.sa',
        lastLoggedIn: new Date('2025-06-07T05:40:00'),
        status: 'ACTIVE'
      },
      {
        vendorName: 'شركة الخليج للاستثمار',
        firstName: 'محمد',
        lastName: 'بن أحمد الخليفي',
        email: 'mohammed.ahmed@gulf-investment.com',
        lastLoggedIn: new Date('2025-06-07T04:44:00'),
        status: 'ACTIVE'
      },
      {
        vendorName: 'شركة صالح الشميلي للتجارة العامة والمقاولات',
        firstName: 'صالح',
        lastName: 'الشميلي',
        email: 'saleh@alshamili.vip',
        lastLoggedIn: new Date('2025-03-07T12:23:00'),
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