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
  template: ``
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