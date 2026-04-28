import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductPage } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;
  private adminApi = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  getProducts(page = 0, size = 12, sortBy = 'id', direction = 'asc',
    categoryId?: number, group?: string, search?: string): Observable<ProductPage> {
    let params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy).set('direction', direction);
    if (categoryId) params = params.set('categoryId', categoryId);
    if (group) params = params.set('group', group);
    if (search) params = params.set('search', search);
    return this.http.get<ProductPage>(this.api, { params });
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/featured`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>(this.adminApi, data);
  }

  updateProduct(id: number, data: any): Observable<Product> {
    return this.http.put<Product>(`${this.adminApi}/${id}`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApi}/${id}`);
  }
}
