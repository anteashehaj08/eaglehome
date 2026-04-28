import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private adminUrl = `${environment.apiUrl}/admin/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(shippingAddress: string): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, { shippingAddress });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Admin
  getAllOrders(page = 0, size = 20): Observable<any> {
    return this.http.get(`${this.adminUrl}?page=${page}&size=${size}`);
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.adminUrl}/${id}/status`, { status });
  }
}
