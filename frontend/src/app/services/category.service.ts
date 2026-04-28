import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/categories`;
  private adminApi = `${environment.apiUrl}/admin/categories`;
  constructor(private http: HttpClient) {}
  getAll(group?: string): Observable<Category[]> {
    const url = group ? `${this.api}?group=${group}` : this.api;
    return this.http.get<Category[]>(url);
  }
  create(data: Partial<Category>): Observable<Category> { return this.http.post<Category>(this.adminApi, data); }
  update(id: number, data: Partial<Category>): Observable<Category> { return this.http.put<Category>(`${this.adminApi}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.adminApi}/${id}`); }
}
