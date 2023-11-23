import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../services/post.service';

import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLoggedIn: boolean | undefined;
  authToken: string | undefined;
  postsList: any[] = [];
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
        data.forEach((element: any) => {
          element.time_ago = moment(element.created_at, "YYYYMMDD").fromNow(); // 12 years ago
          element.created_at = moment(element.created_at, "YYYYMMDD").format("MMM Do YY"); // 12 years ago
        });
        this.postsList = data;
      });
    } else {
    }
  }





  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
