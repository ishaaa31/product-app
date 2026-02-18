import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('INTERCEPTOR RAN FOR:', req.url);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  
  // DEBUG LOGGING
  console.log('Interceptor processing:', req.method, req.url);
  console.log('Token present:', !!token);
  
  let authReq = req;
  if (token) {
    // Log the token being added (first 20 chars only for security)
    console.log('Adding token:', token.substring(0, 20) + '...');
    
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Verify header was added
    console.log('Header added:', authReq.headers.get('Authorization')?.substring(0, 30) + '...');
  } else {
    console.log('No token available');
  }
  
  // Handle response errors
  return next(authReq).pipe(
    catchError(error => {
      console.error('Interceptor caught error:', error.status, error.message);
      
      if (error.status === 401) {
        console.log('401 Unauthorized - logging out');
        // Auto logout if 401 response returned from api
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};