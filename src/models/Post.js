const db = require("../database");
const { v4: uuid } = require("uuid");

class Post {
  constructor(post) {
    this.id = uuid();
    this.title = post.username;
    this.content = post.email;
    this.author = post.author;
  }

  /** 
   * 
   * Getters
   * 
   **/

  static getAllPosts(callback) {
    db.query("SELECT * FROM post", (err, results) => {
      callback(err, results);
    });
  }

  static createPost(post, callback) {

    const { uuid, title, content, author } = post;

    if (!uuid || !title || !content || !author) {
      const error = new Error("Missing required fields");
      console.error("Error creating user:", error);
      return callback(error, null);
    }

    db.query(
      "INSERT INTO post (uuid, title, content, author) VALUES (?, ?, ?, ?)",
      [uuid, title, content, author],
      (err, results) => {
        if (err) {
          console.error("Error creating user:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
      
  }

}

module.exports = Post;
