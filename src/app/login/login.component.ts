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
    
    const credentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    };
    
    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = `${response.user.email} logged in successfully!`;
        
        // Redirecting after a short delay to show message
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        setTimeout(() => this.router.navigateByUrl(returnUrl), 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed';
      }
    });
  }
}