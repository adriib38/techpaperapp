import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { PostService } from '../services/post.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = '';
  profile: any = {};
  authToken = '';
  postsList: any[] = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private postService: PostService,
    private router: Router
  ) {
    // Get username from URL
    this.username = this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    // Get the auth token
    this.authToken = this.authService.getAuthToken() ?? '';

    this.profileService.getProfileByUsername(this.username).subscribe(
      (data) => {
        console.log('Profile exitoso:', data.profile);
        data.profile.created_at = moment(data.profile.createdAt).format('DD/MM/YYYY');
        this.profile = data.profile;
      },
      (error) => {
        console.error('Error obteniendo el perfil:', error);
        document.body.innerHTML += JSON.stringify(error);
      }
    );

    this.postService.getPostsByUsername(this.username, this.authToken).subscribe(
      (data) => {
        console.log('Posts exitoso:', data);
        this.postsList = data.posts;
      },
      (error) => {
        console.error('Error obteniendo los posts:', error);
        document.body.innerHTML += JSON.stringify(error);
      }
    );
  }

  
}
