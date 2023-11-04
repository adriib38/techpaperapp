const db = require("../database");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");

class User {
  constructor(user) {
    this.uuid = uuid();
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }

  async encryptPassword() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }

  static validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static createUser(user, callback) {
    const { uuid, username, email, password } = user;

    if (!username || !email || !password) {
      const error = new Error("Missing required fields");
      console.error("Error creating user:", error);
      return callback(error, null);
    }


    db.query(
      "INSERT INTO user (uuid, username, email, password) VALUES (?, ?, ?, ?)",
      [uuid, username, email, password],
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

  /** 
   * 
   * Getters
   * 
   **/

  static getAllUsers(callback) {
    db.query("SELECT * FROM user", (err, results) => {
      callback(err, results);
    });
  }

  static getUserById(uuid, callback) {  

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

  static getUserByEmail(email, callback) {  

    // Check if the uuid is received
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


}

module.exports = User;
