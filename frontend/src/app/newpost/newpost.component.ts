import { Component, OnInit } from '@angular/core';
import { NgModule } from "@angular/core";
import { Router } from '@angular/router';
import { Post } from '../Interfaces/Post';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.css']
})
export class NewpostComponent implements OnInit {
  authToken = '';
  
  title: string = '';
  content: string = '';
  categories:[] = [];

  post: Post = {
    title: this.title,
    content: this.content,
    categories: this.categories ?? [],
    created_at: '',
    username: '',
    verified: false,
    likes: 0,
    id: '',
    author_id: '',
    summary: ''
  }
 
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    this.authToken = this.authService.getAuthToken() ?? '';
  }

  onSubmit() {
    this.post = {
      title: this.title,
      content: this.content,
      categories: this.categories ?? [],
      created_at: '',
      username: '',
      verified: false,
      likes: 0,
      id: '',
      author_id: '',
      summary: ''
    }

    console.log(this.post);

    this.postService.createPost(this.post, this.authToken).subscribe(
      (data) => {
        console.log('Post created:', data);
        let postId = data.post_id;

        this.router.navigate([`/post/${postId}`]);
       
      },
      (error) => {
        console.error('Error creating post:', error);
        alert('Error creating post');
      }
    );
  }
}
