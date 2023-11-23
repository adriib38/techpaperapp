import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn: boolean | undefined;
  authToken: string | undefined;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    // Subscribe to the authentication state
    this.authSubscription = authService.isAuthenticated$.subscribe(
      (authenticated) => {
        this.isLoggedIn = authenticated;
      }
    );
  }

  ngOnInit() {
    
    console.log('Logged?: ' + this.isLoggedIn);

    this.handleAuthenticationLogic();
   
  }

  private handleAuthenticationLogic(): void {
    if (this.isLoggedIn) {
      // Get the auth token
      this.authToken = this.authService.getAuthToken() ?? '';
      console.log('Authenticated: ' + this.isLoggedIn);

      this.postService.getAllPosts(this.authToken).subscribe((data) => {
        console.log(data);
        document.getElementById('posts')!.innerHTML = JSON.stringify(data);
      });
    } else {
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
