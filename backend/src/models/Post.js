const db = require("../database");
const { v4: uuid } = require("uuid");
const { search } = require("../v1/routes/post");

class Post {
  constructor(post) {
    this.id = uuid();
    this.title = post.title;
    this.content = post.content;
    this.categories = post.categories;
    this.created_at = post.created_at;
    this.author = post.author;
  }

  /*
  SELECT
    p.title,
    p.id,
    p.content,
    p.created_at,
    p.categories,
    p.author_id,
    LEFT(content, 290) AS 'summary',
    COUNT(lp.id) AS 'likes',
    us.username,
    pr.verified,
     CASE WHEN p.author_id = ? THEN 1 ELSE 0 END AS is_author
FROM
    post p
LEFT JOIN likepost lp ON
    p.id = lp.post_id
LEFT JOIN USER us ON
    p.author_id = us.uuid
LEFT JOIN PROFILE pr ON
    us.uuid = pr.user_uuid
GROUP BY
    p.id
ORDER BY
    p.created_at
DESC;
*/
  static getAllPosts(user_uuid, callback) {
    db.query(
      `
      SELECT
      p.title,
      p.id,
      p.content,
      p.created_at,
      p.categories,
      p.author_id,
      LEFT(content, 290) AS 'summary',
      COUNT(lp.id) AS 'likes',
      us.username,
      pr.verified,
       CASE WHEN p.author_id = ? THEN 1 ELSE 0 END AS is_author
  FROM
      post p
  LEFT JOIN likepost lp ON
      p.id = lp.post_id
  LEFT JOIN USER us ON
      p.author_id = us.uuid
  LEFT JOIN PROFILE pr ON
      us.uuid = pr.user_uuid
  GROUP BY
      p.id
  ORDER BY
      p.created_at
  DESC;
    `,
      [user_uuid],
      (err, results) => {
        callback(err, results);
      }
    );
  }

  static getWallPosts(user_uuid, callback) {
    db.query(
      `
      SELECT DISTINCT
      p.*, COUNT(lp.id) AS likes, us.username, left (content, 290) as 'summary', pr.verified,
      CASE WHEN p.author_id = ? THEN 1 ELSE 0 END AS is_author
      FROM post p
      LEFT JOIN FOLLOWS ON p.author_id = FOLLOWS.followed_uuid
      LEFT JOIN likepost lp ON p.id = lp.post_id
      LEFT JOIN user us on p.author_id = us.uuid
      LEFT JOIN profile pr on us.uuid = pr.user_uuid
      WHERE follows.follower_uuid = ? OR p.author_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `,
      [user_uuid, user_uuid, user_uuid],
      (err, results) => {
        if (err) {
          return callback(err, null); // Handle the database query error
        } else {
          return callback(null, results);
        }
      }
    );
  }

  static getPostById(id, user_uuid, callback) {
    // Check if the id is received
    if (!id) {
      const error = new Error("Missing required fields");
      console.error("Error getting post:", error);
      return callback(error, null);
    }

    db.query(
      `
      SELECT
      p.title,
      p.content,
      p.created_at,
      p.categories,
      p.author_id,
      LEFT(content, 290) AS 'summary',
      COUNT(lp.id) AS 'likes',
      us.username,
      pr.verified,
      CASE WHEN p.author_id = ? THEN 1 ELSE 0
  END AS is_author
  FROM
      post p
  LEFT JOIN likepost lp ON
      p.id = lp.post_id
  LEFT JOIN USER us ON
      p.author_id = us.uuid
  LEFT JOIN PROFILE pr ON
      us.uuid = pr.user_uuid
  WHERE
      p.id = ?
  GROUP BY
      p.id;
    `,
      [user_uuid, id],
      (err, results) => {
        if (err) {
          return callback(err, null); // Handle the database query error
        }

        if (results && results.length > 0) {
          return callback(null, results[0]); // Return the first result if available
        } else {
          return callback(null, null); // Handle the case when no post is found
        }
      }
    );
  }

  static createPost(post, callback) {
    const { id, title, content, categories, author, created_at } = post;

    if (!id || !title || !content || !author || !categories || !created_at) {
      const error = new Error("Missing required fields");
      console.error("Error creating post:", error);
      return callback(error, null);
    }

    db.query(
      "INSERT INTO post (id, title, content, categories, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, content, categories, author, created_at],
      (err, results) => {
        if (err) {
          console.error("Error creating user:", err);
          callback(err, null);
        } else {
          callback(null, results, id);
        }
      }
    );
  }

  static getPostsByUsername(username, user_uuid, callback) {
    // Check if the uuid is received
    if (!username) {
      const error = new Error("Missing required fields");
      console.error("Error getting user:", error);
      return callback(error, null);
    }

    db.query(
      ` 
      SELECT
      PO.id,
      username,
      title,
      content,
      categories,
      LEFT(content, 290) AS 'summary',
      COUNT(lp.id) AS 'likes',
      PO.created_at,
      pr.verified,
      CASE WHEN po.author_id = ? THEN 1 ELSE 0 END as is_author
      FROM
          post PO
      JOIN USER US ON
          PO.author_id = US.uuid
      LEFT JOIN likepost lp ON
          po.id = lp.post_id
      LEFT JOIN profile pr ON po.author_id = pr.user_uuid
      WHERE
          US.username LIKE ?
      GROUP BY
          PO.id
      ORDER BY
          PO.created_at
      DESC;
      `,
      [user_uuid, username],
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

    db.query("DELETE FROM `post` WHERE id = ?", 
    [id], 
    (err, results) => {
      if (err) {
        console.error("Error deleting post:", err);
        callback(null, results);
      } else {
        callback(null, results);
      }
    });
  }

  static getPostsByCategory(category, user_uuid, callback) {
    if (!category) {
      const error = new Error("Missing required fields");
      console.error("Error getting post:", error);
      return callback(error, null);
    }

    category = "%" + category + "%";

    db.query(
      "SELECT *, CASE WHEN po.author_id = ? THEN 1 ELSE 0 END as is_author FROM post as po WHERE categories LIKE ?;",
      [user_uuid, category],
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

  static getSearchPost(search, user_uuid, callback) {
    if (!search) {
      const error = new Error("Missing required fields");
      return callback(error, null);
    }

    search = "%" + search + "%";

    db.query(
      `
      SELECT post.id, post.title, post.content, post.created_at, PROFILE.name, USER.username, COUNT(likepost.id) AS likes, CASE WHEN post.author_id = ? THEN 1 ELSE 0 END AS is_author FROM post JOIN USER ON post.author_id = USER.uuid JOIN PROFILE ON USER.uuid = PROFILE.user_uuid LEFT JOIN likepost ON post.id = likepost.post_id WHERE post.title LIKE ? GROUP BY post.id; 
      `,
      [user_uuid, search],
      (err, results) => {
        if (err) {
          console.error("Error getting post:", err);
          return callback(err, null);
        }

        callback(null, results);
      }
    );
  }
}

module.exports = Post;
