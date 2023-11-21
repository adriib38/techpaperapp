import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean | undefined;
  profileUsername: string | undefined;
  authToken: string | undefined;

  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Get the auth token
    this.authToken = this.authService.getAuthToken() ?? '';
    // Subscribe to the authentication state
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
      }
    );

    this.profileService.getProfileByToken(this.authToken).subscribe((data) => {
      this.profileUsername = data.profile.username;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
