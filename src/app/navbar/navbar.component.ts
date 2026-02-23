import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: ``
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  
  isLoggedIn$ = this.authService.isAuthenticated$;
  currentUser: any = null;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    this.authService.isAuthenticated$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.currentUser = this.authService.getCurrentUser();
      } else {
        this.currentUser = null;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}