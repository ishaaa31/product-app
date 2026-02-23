import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: ``
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  get fullName() { return this.registerForm.get('fullName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const userData = {
      fullName: this.registerForm.value.fullName || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || ''
    };
    
    this.authService.register(userData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = `${response.email} registered successfully! Redirecting to login...`;
        this.registerForm.reset();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed';
      }
    });
  }
}