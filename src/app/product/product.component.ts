import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  productList: any[] = [];
  isEditMode = false;
  
  // base API URL
  private baseUrl = 'http://localhost:5270/api/Product';

  constructor() {}

  product = this.getEmptyProduct();

  ngOnInit(): void {
    this.getAll();
  }

  getEmptyProduct() {
    return {
      productId: 0,
      productName: '',
      productPrice: 0,
      productDescription: '',
      productCategory: '',
      isExpire: false,
      dateTime: ''
    };
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    console.log('Adding product with token:', this.authService.getToken()?.substring(0, 20) + '...');
    
    this.http.post(`${this.baseUrl}/AddProduct`, this.product, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Add success:', response);
          alert('Product Added Successfully!');
          this.resetForm();
          this.getAll();
        },
        error: (error) => {
          console.error('Add error:', error);
          if (error.status === 401) {
            alert('Your session has expired. Please login again.');
            this.authService.logout();
          } else {
            alert('Error adding product: ' + (error.error?.message || 'Unknown error'));
          }
        }
      });
  }

  updateProduct() {
    console.log('Updating product:', this.product);
    console.log('Product ID:', this.product.productId);
    
    if (!this.product.productId) {
      alert('Error: Product ID is missing');
      return;
    }
    
    this.http.put(`${this.baseUrl}/UpdateProduct/${this.product.productId}`, this.product, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Update success:', response);
          alert('Product Updated Successfully!');
          this.resetForm();
          this.getAll();
        },
        error: (error) => {
          console.error('Update error:', error);
          if (error.status === 401) {
            alert('Your session has expired. Please login again.');
            this.authService.logout();
          } else {
            alert('Error updating product: ' + (error.error?.message || 'Unknown error'));
          }
        }
      });
  }

  getAll() {
    console.log('Fetching all products');
    
    this.http.get(`${this.baseUrl}/getAllProduct`)
      .subscribe({
        next: (res: any) => {
          console.log('Products fetched:', res?.length || 0);
          this.productList = res || [];
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          if (error.status === 401) {
            alert('Your session has expired. Please login again.');
            this.authService.logout();
          }
        }
      });
  }

  setEdit(item: any) {
    console.log('Editing product:', item);
    this.product = { ...item };
    if (this.product.dateTime) {
      const date = new Date(this.product.dateTime);
      this.product.dateTime = date.toISOString().slice(0, 16);
    }
    this.isEditMode = true;
  }

  // 🔴 FIXED: Added responseType: 'text'
  deleteProduct(id: number) {
    console.log('Attempting to delete product ID:', id);
    console.log('Current token:', this.authService.getToken()?.substring(0, 20) + '...');
    
    if (!id) {
      alert('Error: Invalid product ID');
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.baseUrl}/DeleteProduct/${id}`, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            console.log('Delete success:', response);
            alert('Product Deleted Successfully!');
            this.getAll();
          },
          error: (error) => {
            console.error('Delete error:', error);
            if (error.status === 401) {
              alert('Your session has expired. Please login again.');
              this.authService.logout();
            } else if (error.status === 404) {
              alert('Product not found');
            } else {
              alert('Error deleting product: ' + (error.error?.message || 'Unknown error'));
            }
          }
        });
    }
  }

  resetForm() {
    this.product = this.getEmptyProduct();
    this.isEditMode = false;
  }
}