import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
              <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
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
                
                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
                
                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-3">
                <p>Don't have an account? <a routerLink="/register">Register</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  model = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.model).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}