import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ProductListResponse } from '../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Product List</h2>
        <button class="btn btn-primary" (click)="addNewProduct()">
          Add New Product
        </button>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && products.length === 0" class="alert alert-info">
        No products available. Click "Add New Product" to create one.
      </div>

      <table class="table table-bordered table-striped" *ngIf="!loading && products.length > 0">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Has Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of products">
            <td>{{ product.productId }}</td>
            <td>{{ product.productName }}</td>
            <td>{{ product.productPrice | currency:'INR':'symbol':'1.0-0' }}</td>
            <td>{{ product.productCategory }}</td>
            <td>
              <span class="badge" [class.bg-success]="product.hasDetails" [class.bg-secondary]="!product.hasDetails">
                {{ product.hasDetails ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" (click)="viewDetails(product.productId)">
                View
              </button>
              <button class="btn btn-sm btn-warning me-2" (click)="editProduct(product.productId)">
                Edit
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteProduct(product.productId)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  
  products: ProductListResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: ProductListResponse[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  addNewProduct(): void {
    this.router.navigate(['/product-form']);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/product-form', id, 'view']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/product-form', id, 'edit']);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error: HttpErrorResponse) => {
          alert('Error deleting product: ' + error.error);
        }
      });
    }
  }
}