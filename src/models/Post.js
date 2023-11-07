const db = require("../database");
const { v4: uuid } = require("uuid");

class Post {
  constructor(post) {
    this.id = uuid();
    this.title = post.username;
    this.content = post.email;
    this.author = post.author;
  }

  static getAllPosts(callback) {
    db.query(`
      SELECT p.title, p.content, p.created_at, p.author_id, COUNT(lp.id)
      FROM 'post' p
      JOIN likepost lp 
      ON p.id = lp.post_id;`, 
      (err, results) => {
      callback(err, results);
    });
  }

  static getPostById(id, callback) {
    // Check if the id is received
    if (!id) {
      const error = new Error("Missing required fields");
      console.error("Error getting post:", error);
      return callback(error, null);
    }

    db.query("SELECT * FROM post WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err, null); // Handle the database query error
      }

      if (results && results.length > 0) {
        return callback(null, results[0]); // Return the first result if available
      } else {
        return callback(null, null); // Handle the case when no post is found
      }
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

  static getPostsByUsername(username, callback) {
    // Check if the uuid is received
    if (!username) {
      const error = new Error("Missing required fields");
      console.error("Error getting user:", error);
      return callback(error, null);
    }

    db.query(
      "SELECT username, title, content, PO.created_at FROM`post` PO JOIN `user` US ON PO.author_id = US.uuid WHERE US.username LIKE ?",
      [username],
      (err, results) => {
        if (err) {
          console.error("Error getting user:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
  }

  static deletePostById(id, callback) {
    // Check if the id is received
    if (!id) {
      const error = new Error("Missing required fields");
      console.error("Error getting post:", error);
      return callback(error, null);
    }

    db.query("DELETE FROM `post` WHERE id = ?", [id], (err, results) => {
      if (err) {
        console.error("Error deleting post:", err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
}

module.exports = Post;
