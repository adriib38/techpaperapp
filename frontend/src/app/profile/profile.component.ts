import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

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
    private profileService: ProfileService,
    private router: Router
  ) {
    // Get username from URL
    this.username = this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    this.profileService.getProfileByUsername(this.username).subscribe(
      (data) => {
        console.log('Profile exitoso:', data.profile);
        document.body.innerHTML += JSON.stringify(data.profile);
      },
      (error) => {
        console.error('Error obteniendo el perfil:', error);
        document.body.innerHTML += JSON.stringify(error);
      }
    );
  }

  
}
