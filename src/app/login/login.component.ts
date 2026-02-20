import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
              <!-- Email/Password Login Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    formControlName="email"
                    [class.is-invalid]="email?.invalid && email?.touched"
                  />
                  <div *ngIf="email?.invalid && email?.touched" class="invalid-feedback">
                    <div *ngIf="email?.errors?.['required']">Email is required</div>
                    <div *ngIf="email?.errors?.['email']">Valid email is required</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    formControlName="password"
                    [class.is-invalid]="password?.invalid && password?.touched"
                  />
                  <div *ngIf="password?.invalid && password?.touched" class="invalid-feedback">
                    <div *ngIf="password?.errors?.['required']">Password is required</div>
                    <div *ngIf="password?.errors?.['minlength']">Minimum 6 characters</div>
                  </div>
                </div>
                
                <!-- Success message -->
                <div *ngIf="successMessage" class="alert alert-success">
                  {{ successMessage }}
                </div>
                
                <!-- Error message -->
                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
                
                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                  </button>
                </div>
              </form>

              <!-- Divider -->
              <div class="divider d-flex align-items-center my-4">
                <hr class="flex-grow-1">
                <span class="mx-2 text-muted">OR</span>
                <hr class="flex-grow-1">
              </div>

              <!-- Google Sign-In Button -->
              <div class="d-grid">
                <button 
                  class="btn btn-outline-dark d-flex align-items-center justify-content-center w-100" 
                  (click)="loginWithGoogle()"
                  [disabled]="isLoading">
                  <svg width="20" height="20" viewBox="0 0 24 24" class="me-2">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <!-- Register Link -->
              <div class="text-center mt-3">
                <p>Don't have an account? <a routerLink="/register">Register</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- styles inline -->
    <style>
      .divider hr {
        border-top: 1px solid #e0e0e0;
        margin: 0;
      }
      .btn-outline-dark {
        background-color: #ffffff;
        border: 1px solid #dadce0;
        color: #3c4043;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      .btn-outline-dark:hover {
        background-color: #f8f9fa;
        border-color: #d2e3fc;
      }
      .btn-outline-dark:active {
        background-color: #e8f0fe;
      }
      .btn-outline-dark:disabled {
        background-color: #f1f3f4;
        border-color: #f1f3f4;
        color: #9aa0a6;
      }
    </style>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  successMessage = '';  
  errorMessage = '';
  isLoading = false;
  googleError = '';

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.successMessage = '';  
    this.errorMessage = '';
    this.googleError = '';
    
    const credentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    };
    
    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = `${response.user.email} logged in successfully!`;
        
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        setTimeout(() => this.router.navigateByUrl(returnUrl), 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed';
      }
    });
  }
  loginWithGoogle(): void {
    this.isLoading = true;
    this.googleError = '';
    
    try {
      // Redirect to backend Google authentication endpoint
      window.location.href = 'http://localhost:5270/api/Auth/ExternalLogin?provider=Google';
    } catch (error) {
      this.isLoading = false;
      this.googleError = 'Failed to redirect to Google login. Please try again.';
      console.error('Google login error:', error);
    }
  }
}