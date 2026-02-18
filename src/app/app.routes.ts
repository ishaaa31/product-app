import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  
  { 
    path: 'register', 
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  
  { 
    path: 'products', 
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'product-form', 
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'product-form/:id/:mode', 
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard]
  },
  
  { path: '**', redirectTo: '/login' }
];