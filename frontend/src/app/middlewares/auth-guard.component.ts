import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // If the user is not logged in we'll send them back to the home page
    if (!this.authService.isAuthenticated$) {
      console.warn('Access denied!');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // If the user is not logged in we'll send them back to the home page
    if (this.authService.isAuthenticated$) {
      console.warn('Access denied!');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

}
