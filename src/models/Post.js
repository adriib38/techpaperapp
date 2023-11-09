const db = require("../database");
const { v4: uuid } = require("uuid");

class Post {
  constructor(post) {
    this.id = uuid();
    this.title = post.title;
    this.content = post.content;
    this.categories = post.categories;
    this.author = post.author;
  }

  static getAllPosts(callback) {
    db.query(`
      SELECT p.title, p.content, p.created_at, p.categories, p.author_id, COUNT(lp.id) AS 'likes'
      FROM post p
      LEFT JOIN likepost lp 
      ON p.id = lp.post_id
      GROUP BY p.id;`, 
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
    const { id, title, content, author } = post;

    if (!id || !title || !content || !author) {
      const error = new Error("Missing required fields");
      console.error("Error creating post:", error);
      return callback(error, null);
    }

    db.query(
      "INSERT INTO post (id, title, content, author_id) VALUES (?, ?, ?, ?)",
      [id, title, content, author],
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
      "SELECT username, title, content, categories, PO.created_at FROM `post` PO JOIN `user` US ON PO.author_id = US.uuid WHERE US.username LIKE ?",
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

  static getPostsByCategory(category, callback) {
    if (!category) {
      const error = new Error("Missing required fields");
      console.error("Error getting post:", error);
      return callback(error, null);
    }

    category = "%" + category + "%";

    db.query(
      "SELECT * FROM `post` WHERE categories LIKE ?",
      [category],
      (err, results) => {
        if (err) {
          console.error("Error getting post:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
  }
}

module.exports = Post;
