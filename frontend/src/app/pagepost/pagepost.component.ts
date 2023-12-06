import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router' 
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Post } from '../Interfaces/Post';

@Component({
  selector: 'app-pagepost',
  templateUrl: './pagepost.component.html',
  styleUrls: ['./pagepost.component.css']
})
export class PagePostComponent implements OnInit {
  authToken = '';
  postId = '';
  post: Post = {
    title: '',
    content: '',
    categories: [],
    created_at: '',
    username: '',
    verified: false,
    likes: 0,
    id: '',
    author_id: '',
    summary: ''
  };

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    this.postId = this.router.url.split('/')[2];
  }

  ngOnInit(): void {
    // Get the auth token
    this.authToken = this.authService.getAuthToken() ?? '';

    this.postService.getPostById(this.postId, this.authToken).subscribe(
      (data) => {
        console.log('Post exitoso:', data);
        this.post = data.post;
        if (data.post.categories) {
          this.post.categories = data.post.categories.split(',');
        }

        
      },
      (error) => {
        console.error('Error obteniendo el post:', error);
        document.body.innerHTML += JSON.stringify(error);
      });
}
}