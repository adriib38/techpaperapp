import { Post } from '../Interfaces/Post';

export class PostClass implements Post {
  title: string = '';
  content: string = '';
  categories: [] = [];
  created_at: string = '';
  username: string = '';
  verified: boolean = false;
  likes: number = 0;

  constructor() {
    // Puedes proporcionar valores predeterminados si es necesario
  }

}
