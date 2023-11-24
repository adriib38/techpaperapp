const db = require("../database");
const { v4: uuid } = require("uuid");

class Profile {
  constructor(profile) {
    this.id = uuid();
    this.user_uuid = profile.user_uuid;
    this.name = profile.name;
    this.bio = profile.bio;
  }

  static createProfile(profile, callback) {
    const { id, user_uuid, name } = profile;

    if (!name) {
      const error = new Error("Missing required fields");
      console.error("Error creating profile:", error);
      return callback(error, null);
    }

    db.query(
      "INSERT INTO profile (id, user_uuid, name) VALUES (?, ?, ?)",
      [id, user_uuid, name],
      (err, results) => {
        if (err) {
          console.error("Error creating profile:", err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
  }

  static getProfileByUuid(uuid, callback) {
    if (!uuid || uuid === "") {
      const error = new Error("Missing required fields");
      console.error("Error getting user profile:", error);
      return callback(error, null);
    }

    db.query(
      `
      SELECT USR.username, USR.email, PRO.name, PRO.bio, USR.created_at, PRO.verified, COUNT(POS.id) AS 'n_posts'
      FROM profile PRO 
      JOIN user USR ON PRO.user_uuid = USR.uuid
      JOIN post POS ON USR.uuid = POS.author_id
      WHERE PRO.user_uuid = ?
      `,
      [uuid],
      (err, results) => {
        if (err) {
          return callback(err, null);
        } else if (results && results.length > 0) {
          return callback(null, results[0]);
        } else {
          return callback(err, null);
        }
      }
    );
  }

  static getProfileByUsername(username, callback) {
    if (!username || username === "") {
      const error = new Error("Missing required fields");
      console.error("Error getting profile:", error);
      return callback(error, null);
    }

    db.query(
      `
      SELECT
      USR.username,
      USR.email,
      PRO.name,
      PRO.verified,
      PRO.bio,
      USR.created_at,
      COUNT(POS.id) AS 'n_posts'
    FROM user USR
    JOIN profile PRO ON USR.uuid = PRO.user_uuid
    LEFT JOIN post POS ON USR.uuid = POS.author_id
    WHERE USR.username = ?
    GROUP BY USR.username, USR.email, PRO.name, PRO.bio, USR.created_at;
      `,
      [username],
      (err, results) => {
        console.log("results", results);
        if (err) {
          return callback(err, null);
        } else {

        return callback(null, results[0]);
        }
      }
    );
  }
}

module.exports = Profile;
