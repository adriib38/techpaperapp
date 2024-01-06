import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../Interfaces/Post';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.css']
})
export class PostComponentComponent implements OnInit {
  @Input() post: Post | undefined;
  authToken = '';

  
  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.authToken = this.authService.getAuthToken() ?? '';
  }

  onDeletePost(postId: string | undefined): void {
    console.log('OnDeletePost()')
    this.postService.deletePostById(postId!, this.authToken).subscribe(
      (data) => {
        console.log('Post deleted:', data);

      },
      (error) => {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    )

  }
}
