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
  post: Post | undefined;
  title: string = '';
  content: string = '';
  categories:[] = [];

 
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


    console.log(this.post);

    this.postService.createPost(this.post, this.authToken).subscribe(
      (data) => {
        console.log('Post creado:', data);
        let postId = data.post_id;

        this.router.navigate([`/post/${postId}`]);
       
      },
      (error) => {
        console.error('Error durante el registro:', error);
        alert('Error al crear el post');
      }
    );

  }

}
