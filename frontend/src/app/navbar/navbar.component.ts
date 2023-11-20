import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean | undefined;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {
    // Subscribe to the authentication state
    this.authSubscription = authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
