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
  template: ``
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