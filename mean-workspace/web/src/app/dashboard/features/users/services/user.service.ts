import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, PaginatedUsersResponse } from '../user.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  private mockUsers: User[] = [
    // Vendor Users
    {
      organizationName: 'شركة الخليج للتجارة والاستثمار والتنمية',
      firstName: 'خالد',
      lastName: 'الشمري',
      email: 'khalid@gulf-trading.com.sa',
      lastLoggedIn: new Date('2025-06-07T09:18:00'),
      status: 'ACTIVE',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة الشرق الأوسط للتجارة والتنمية الاقتصادية',
      firstName: 'أحمد',
      lastName: 'الجابري',
      email: 'ahmed@middle-east-trading.com.sa',
      lastLoggedIn: new Date('2025-06-07T08:34:00'),
      status: 'INACTIVE',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة الرياض للتجارة والصناعة',
      firstName: 'طارق',
      lastName: 'العوض',
      email: 'tariq@riyadh-trading.com.sa',
      lastLoggedIn: new Date('2025-06-07T07:48:00'),
      status: 'ACTIVE',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة مكاتب للتنمية والاستثمار العقاري والتجاري',
      firstName: 'محمد',
      lastName: 'مرتكار',
      email: 'mohammed@maktab-real-estate.com',
      lastLoggedIn: new Date('2025-06-07T06:59:00'),
      status: 'PENDING',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة أبراج الخليج للتنمية والاستثمار',
      firstName: 'أحمد',
      lastName: 'علي أحمد محمود',
      email: 'ahmed@gulf-towers.com.sa',
      lastLoggedIn: new Date('2025-06-07T05:40:00'),
      status: 'ACTIVE',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة الخليج للاستثمار',
      firstName: 'محمد',
      lastName: 'بن أحمد الخليفي',
      email: 'mohammed.ahmed@gulf-investment.com',
      lastLoggedIn: new Date('2025-06-07T04:44:00'),
      status: 'ACTIVE',
      organization: 'vendor'
    },
    {
      organizationName: 'شركة صالح الشميلي للتجارة العامة والمقاولات',
      firstName: 'صالح',
      lastName: 'الشميلي',
      email: 'saleh@alshamili.vip',
      lastLoggedIn: new Date('2025-03-07T12:23:00'),
      status: 'ACTIVE',
      organization: 'vendor'
    },
    // Client Users
    {
      organizationName: 'شركة نور للاستثمار والتطوير العقاري',
      firstName: 'ناصر',
      lastName: 'الشهراني',
      email: 'n.alshahrani@noor.com',
      lastLoggedIn: new Date('2025-06-07T07:00:00'),
      status: 'ACTIVE',
      organization: 'client'
    },
    {
      organizationName: 'شركة نور للاستثمار والتطوير العقاري',
      firstName: 'سامي',
      lastName: 'الغامدي',
      email: 'sami.alghamdi@noor.com.sa',
      lastLoggedIn: new Date('2025-06-07T06:45:00'),
      status: 'ACTIVE',
      organization: 'client'
    },
    {
      organizationName: 'شركة نور للاستثمار والتطوير العقاري',
      firstName: 'عمر',
      lastName: 'الشمالي',
      email: 'o.alshamali@noor.com',
      lastLoggedIn: new Date('2025-06-07T06:11:00'),
      status: 'ACTIVE',
      organization: 'client'
    },
    {
      organizationName: 'Requested Volume',
      firstName: 'Request',
      lastName: 'Volume',
      email: 'requestvolume@youmail.com',
      lastLoggedIn: new Date('2025-06-07T05:59:00'),
      status: 'ACTIVE',
      organization: 'client'
    },
    {
      organizationName: 'شركة مجموعة الأعمال الاستثمارية المتطورة',
      firstName: 'عبدالرحمن',
      lastName: 'راجحي',
      email: 'bajaaber@outlook.jp',
      lastLoggedIn: new Date('2025-03-07T12:46:00'),
      status: 'ACTIVE',
      organization: 'client'
    },
    {
      organizationName: 'شركة الخليج للعقارات',
      firstName: 'أحمد',
      lastName: 'رياض',
      email: 'ar.ragan@gulfproperties.com',
      lastLoggedIn: new Date('2025-03-07T07:42:00'),
      status: 'ACTIVE',
      organization: 'client'
    }
  ];

  getUsers(page = 1, limit = 10, filter: string | null = null): Observable<PaginatedUsersResponse> {
    let filteredUsers = [...this.mockUsers];

    // Apply filter if provided
    if (filter && filter.trim()) {
      const filterLower = filter.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
         user.organizationName.toLowerCase().includes(filterLower) ||
         user.firstName.toLowerCase().includes(filterLower) ||
         user.lastName.toLowerCase().includes(filterLower) ||
         user.email.toLowerCase().includes(filterLower) ||
         user.status.toLowerCase().includes(filterLower) ||
         user.organization.toLowerCase().includes(filterLower)
         );
    }

    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return of({
      users: paginatedUsers,
      total: total
    });
  }

  getUserStats(): Observable<{totalUsers: number, totalActive: number, totalInactive: number, totalPending: number, vendorStats: any, clientStats: any}> {
    const totalUsers = this.mockUsers.length;
    const totalActive = this.mockUsers.filter(user => user.status.toUpperCase() === 'ACTIVE').length;
    const totalInactive = this.mockUsers.filter(user => user.status.toUpperCase() === 'INACTIVE').length;
    const totalPending = this.mockUsers.filter(user => user.status.toUpperCase() === 'PENDING').length;
    
    const vendorUsers = this.mockUsers.filter(user => user.organization === 'vendor');
    const clientUsers = this.mockUsers.filter(user => user.organization === 'client');
    
    const vendorStats = {
      total: vendorUsers.length,
      active: vendorUsers.filter(user => user.status.toUpperCase() === 'ACTIVE').length,
      inactive: vendorUsers.filter(user => user.status.toUpperCase() === 'INACTIVE').length,
      pending: vendorUsers.filter(user => user.status.toUpperCase() === 'PENDING').length
    };
    
    const clientStats = {
      total: clientUsers.length,
      active: clientUsers.filter(user => user.status.toUpperCase() === 'ACTIVE').length,
      inactive: clientUsers.filter(user => user.status.toUpperCase() === 'INACTIVE').length,
      pending: clientUsers.filter(user => user.status.toUpperCase() === 'PENDING').length
    };
    
    return of({
      totalUsers,
      totalActive,
      totalInactive,
      totalPending,
      vendorStats,
      clientStats
    });
  }

  // Future API methods (commented for now)
  // getUserById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`);
  // }
  
  // createUser(user: any): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, user);
  // }
  
  // updateUser(id: string, user: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  // }
  
  // deleteUser(id: string): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/${id}`);
  // }
}