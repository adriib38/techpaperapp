import { Component, Input } from '@angular/core';
import { Post } from '../Interfaces/Post';

@Component({
  selector: 'app-post',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.css']
})
export class PostComponentComponent {
  @Input() post: Post | undefined;
  
}
