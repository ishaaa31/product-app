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
  template: ``
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
    dateTime: new Date().toISOString().slice(0, 16) || null,
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
          dateTime: data.dateTime ? data.dateTime.slice(0, 16) : new Date().toISOString().slice(0, 16) || null,
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