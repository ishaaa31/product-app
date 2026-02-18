import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Register</h3>
            </div>
            <div class="card-body">
              <form #registerForm="ngForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    name="fullName"
                    [(ngModel)]="model.fullName"
                    required
                    #fullName="ngModel"
                  />
                  <div *ngIf="fullName.invalid && fullName.touched" class="text-danger">
                    Full name is required
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    name="email"
                    [(ngModel)]="model.email"
                    required
                    email
                    #email="ngModel"
                  />
                  <div *ngIf="email.invalid && email.touched" class="text-danger">
                    Valid email is required
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    [(ngModel)]="model.password"
                    required
                    minlength="6"
                    #password="ngModel"
                  />
                  <div *ngIf="password.invalid && password.touched" class="text-danger">
                    Password must be at least 6 characters
                  </div>
                </div>
                
                <div *ngIf="successMessage" class="alert alert-success">
                  {{ successMessage }}
                </div>
                
                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
                
                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    {{ isLoading ? 'Registering...' : 'Register' }}
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-3">
                <p>Already have an account? <a routerLink="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  model = {
    fullName: '',
    email: '',
    password: ''
  };
  
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    this.authService.register(this.model).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed';
      }
    });
  }
}