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
      "SELECT * FROM profile WHERE user_uuid = ?",
      [uuid],
      (err, results) => {
        if (err) {
          console.error("Error getting user profile:", err);
          callback(err, null);
        } else if(results.length === 0) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    )
  }
}

module.exports = Profile;
