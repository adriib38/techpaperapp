const db = require("../database");
const { v4: uuid } = require("uuid");

class Post {
  constructor(post) {
    this.id = uuid();
    this.title = post.username;
    this.content = post.email;
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

}

module.exports = Post;
