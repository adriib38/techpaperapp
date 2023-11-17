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

  static getUserProfileByUuid(uuid, callback) {
    if(!uuid || uuid === "") {
      const error = new Error("Missing required fields");
      console.error("Error getting user profile:", error);
      return callback(error, null);
    }

    db.query(
      "SELECT USR.username, USR.email, PRO.name, PRO.bio, USR.created_at FROM profile PRO JOIN user USR ON PRO.user_uuid = USR.uuid WHERE PRO.user_uuid = ?",
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
    )
  }
}

module.exports = Profile;
