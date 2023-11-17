const db = require("../database");
const { v4: uuid } = require("uuid");

class Follow {
  constructor(follow) {
    this.id = uuid();
    this.follower = follow.follower;
    this.followed = follow.followed;
  }

  static createFollow(follow, callback) {
    const { id, follower, followed } = follow;

    if (!follower || !followed) {
      const error = new Error("Missing required fields");
      console.error("Error creating follow:", error);
      return callback(error, null);
    }

    db.query(
      "INSERT INTO follows (id, follower_uuid, followed_uuid) VALUES (?, ?, ?)",
      [id, follower, followed],
      (err, results) => {
        if (err) {
          console.error("Error creating follow:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
  }

  static deleteFollow(follow, callback) {
    const { follower, followed } = follow;

    if (!follower || !followed) {
      const error = new Error("Missing required fields");
      console.error("Error deleting follow:", error);
      return callback(error, null);
    }

    db.query(
      "DELETE FROM follows WHERE follower_uuid = ? AND followed_uuid = ?",
      [follower, followed],
      (err, results) => {
        if (err) {
          // Send the error if there was one
          callback(err, null);
        } else if (results.affectedRows === 0) {
          // If the follow doesn't exist
          callback("Follow not found", null);
        } else {
          // Send the response if no error was thrown
          callback(null, results);
        }
      }
    );
  }

  /**
   * Return users followed by a user in param
   * Users following the user in param
   */
  static getUserFollowed(user_uuid, callback) {
    // Check if the email is received
    if (!user_uuid) {
      const error = new Error("Missing required fields");
      console.error("Error getting followers:", error);
      return callback(error, null);
    }

    db.query(
      `
      SELECT USR.username, PRO.name, PRO.bio, FOL.created_at AS 'follow_since'
      FROM follows FOL
      JOIN profile PRO ON PRO.user_uuid = FOL.followed_uuid
      JOIN user USR ON USR.uuid = FOL.followed_uuid
      WHERE FOL.follower_uuid = ?
      `
      , 
      [user_uuid], (err, results) => {
        if (err) {
          console.error("Error getting followeds:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
    });
  }

  static getUserFollowers(user_uuid, callback) {
    // Check if the email is received
    if (!user_uuid) {
      const error = new Error("Missing required fields");
      console.error("Error getting followers:", error);
      return callback(error, null);
    }

    db.query(
      `
      SELECT USR.username, PRO.name, PRO.bio, FOL.created_at AS 'follow_since' 
      FROM follows FOL 
      JOIN profile PRO ON PRO.user_uuid = FOL.follower_uuid 
      JOIN user USR ON USR.uuid = FOL.follower_uuid 
      WHERE FOL.followed_uuid = ?; 
      `
      , 
      [user_uuid], (err, results) => {
      if (err) {
        console.error("Error getting followers:", err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }

  /*
  static getUserByUuid(uuid, callback) {  

    // Check if the uuid is received
    if (!uuid) {
      const error = new Error("Missing required fields");
      console.error("Error getting user:", error);
      return callback(error, null);
    }

    // Get the user from the database
    db.query("SELECT * FROM user WHERE uuid = ?", [uuid], (err, results) => {
      if (err) {
        console.error("Error getting user:", err);
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  }

  static getUserByUsername(username, callback) {  

    // Check if the uuid is received
    if (!username) {
      const error = new Error("Missing required fields");
      console.error("Error getting user:", error);
      return callback(error, null);
    }

    // Get the user from the database
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error("Error getting user:", err);
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  }

  static getUserByEmail(email, callback) {
    // Check if the email is received
    if (!email) {
      const error = new Error("Missing required fields");
      console.error("Error getting user:", error);
      return callback(error, null);
    }

    // Get the user from the database
    db.query("SELECT * FROM user WHERE email = ?", [email], (err, results) => {
      if (err) {
        console.error("Error getting user:", err);
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  }



  static getUserProfileByUuid(uuid, callback) {
    // Check if the uuid is received
    if (!uuid) {
      const error = new Error("Missing required fields");
      console.error("Error getting profile:", error);
      return callback(error, null);
    }

    // Get the user from the database
    db.query(
      `
      SELECT us.uuid, us.username, pr.name, pr.bio, us.email, COUNT(p.id) AS posts 
      FROM profile pr
      JOIN user us ON pr.user_uuid = us.uuid
      JOIN post p ON p.author_id = us.uuid
      WHERE us.uuid = ?;
      `,
    [uuid], (err, results) => {
      if (err) {
        console.error("Error getting user:", err);
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  }
*/
}

module.exports = Follow;
