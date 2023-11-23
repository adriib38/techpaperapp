import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        console.log('Logged?: ' + authenticated);

        if (!authenticated) {
          console.warn('Access denied!');
          this.router.navigate(['/login']);
        }
      }
    );

    return true;
  }
}
