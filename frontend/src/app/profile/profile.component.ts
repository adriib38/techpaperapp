import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = '';
  profile: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Get username from URL
    this.username = this.router.url.split('/')[2];
  }
  ngOnInit(): void {
    console.log(this.username);
  }

  
}
