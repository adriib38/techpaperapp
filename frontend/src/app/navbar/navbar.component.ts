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
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
        console.log('Logged?: ' + this.isLoggedIn);
        this.handleAuthenticationLogic();
      }
    );
  }

  private handleAuthenticationLogic(): void {
    this.authToken = this.authService.getAuthToken() ?? '';

    if (this.isLoggedIn) {
      this.profileService
        .getProfileByToken(this.authToken)
        .subscribe((data) => {
          this.profileUsername = data.profile.username;
        });
    } else {
    }
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
