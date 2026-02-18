import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductListResponse, ProductResponse, CreateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5270/api/Product';

  getAllProducts(): Observable<ProductListResponse[]> {
    return this.http.get<ProductListResponse[]>(`${this.baseUrl}/getAllProduct`);
  }

  getProductWithDetails(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/GetProductWithDetails/${id}`);
  }

  addProduct(request: CreateProductRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/AddProduct`, request, { responseType: 'text' });
  }

  updateProduct(id: number, request: CreateProductRequest): Observable<string> {
    return this.http.put(`${this.baseUrl}/UpdateProduct/${id}`, request, { responseType: 'text' });
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/DeleteProduct/${id}`, { responseType: 'text' });
  }

  getProductDetails(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetProductDetails/${productId}`);
  }
}