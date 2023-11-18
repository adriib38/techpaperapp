import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLoggedIn: boolean | undefined;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,

  ) {
    this.isLoggedIn = authService.isAuthenticated();

    // Subscribe to the authentication state
    this.authSubscription = authService.isAuthenticated$.subscribe((authenticated) => {
      this.isLoggedIn = authenticated;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
