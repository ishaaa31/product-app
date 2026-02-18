import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CreateProductRequest, ProductResponse } from '../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">
                {{ isViewMode ? 'View Product' : (isEditMode ? 'Edit Product' : 'Add New Product') }}
              </h3>
            </div>
            <div class="card-body">
              <div *ngIf="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <form #productForm="ngForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
                <!-- Product Fields -->
                <h5 class="mb-3">Basic Information</h5>
                
                <div class="mb-3">
                  <label class="form-label">Product Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    name="productName"
                    [(ngModel)]="product.productName"
                    required
                    #name="ngModel"
                    [readonly]="isViewMode"
                  />
                  <div *ngIf="name.invalid && name.touched" class="text-danger">
                    Product name is required
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Price *</label>
                  <input
                    type="number"
                    class="form-control"
                    name="productPrice"
                    [(ngModel)]="product.productPrice"
                    required
                    min="0.01"
                    step="0.01"
                    #price="ngModel"
                    [readonly]="isViewMode"
                  />
                  <div *ngIf="price.invalid && price.touched" class="text-danger">
                    Valid price is required
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Category *</label>
                  <input
                    type="text"
                    class="form-control"
                    name="productCategory"
                    [(ngModel)]="product.productCategory"
                    required
                    #category="ngModel"
                    [readonly]="isViewMode"
                  />
                  <div *ngIf="category.invalid && category.touched" class="text-danger">
                    Category is required
                  </div>
                </div>

                <h5 class="mb-3 mt-4">Additional Details</h5>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    name="productDescription"
                    [(ngModel)]="product.productDescription"
                    rows="3"
                    [readonly]="isViewMode"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Manufacturer</label>
                  <input
                    type="text"
                    class="form-control"
                    name="manufacturer"
                    [(ngModel)]="product.manufacturer"
                    [readonly]="isViewMode"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Weight (e.g., 150 gm, 2 kg)</label>
                  <input
                    type="text"
                    class="form-control"
                    name="weight"
                    [(ngModel)]="product.weight"
                    [readonly]="isViewMode"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Warranty (months)</label>
                  <input
                    type="number"
                    class="form-control"
                    name="warrantyInMonths"
                    [(ngModel)]="product.warrantyInMonths"
                    min="0"
                    [readonly]="isViewMode"
                  />
                </div>

                <div class="form-check mb-3">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    name="isExpire"
                    [(ngModel)]="product.isExpire"
                    [disabled]="isViewMode"
                  />
                  <label class="form-check-label">Is Expired</label>
                </div>

                <div class="mb-3">
                  <label class="form-label">Date Time</label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    name="dateTime"
                    [(ngModel)]="product.dateTime"
                    [readonly]="isViewMode"
                  />
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    Back to List
                  </button>
                  
                  <div>
                    <button
                      *ngIf="!isViewMode"
                      type="submit"
                      class="btn btn-primary"
                      [disabled]="productForm.invalid || isSubmitting"
                    >
                      {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add') }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  product: CreateProductRequest = {
    productName: '',
    productPrice: 0,
    productCategory: '',
    productDescription: '',
    isExpire: false,
    dateTime: new Date().toISOString().slice(0, 16),
    manufacturer: '',
    weight: '',
    warrantyInMonths: 0
  };
  
  productId: number | null = null;
  isEditMode = false;
  isViewMode = false;
  loading = false;
  isSubmitting = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.paramMap.get('mode');
    
    if (id) {
      this.productId = +id;
      this.isViewMode = mode === 'view';
      this.isEditMode = mode === 'edit';
      this.loadProduct();
    }
  }

  loadProduct(): void {
    if (!this.productId) return;
    
    this.loading = true;
    this.productService.getProductWithDetails(this.productId).subscribe({
      next: (data: ProductResponse) => {
        this.product = {
          productName: data.productName,
          productPrice: data.productPrice,
          productCategory: data.productCategory,
          productDescription: data.productDescription,
          isExpire: data.isExpire,
          dateTime: data.dateTime ? data.dateTime.slice(0, 16) : new Date().toISOString().slice(0, 16),
          manufacturer: data.manufacturer,
          weight: data.weight,
          warrantyInMonths: data.warrantyInMonths
        };
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        alert('Error loading product: ' + error.error);
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    if (this.isEditMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.isSubmitting = false;
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          alert('Error updating product: ' + error.error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(this.product).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.isSubmitting = false;
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          alert('Error adding product: ' + error.error);
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}