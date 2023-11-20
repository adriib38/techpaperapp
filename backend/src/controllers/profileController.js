const User = require("../models/User");
const Profile = require("../models/Profile");

require("dotenv").config();

// Return the user data from the token
const me = async (req, res, next) => {

  Profile.getProfileByUuid(req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting profile", error: err });
    }

    res.status(200).json({ message: "Profile found", profile: results });
  });
}

// Return the user data from the token
const getProfileByUsername = async (req, res, next) => {
  let { username } = req.params;
  console.log("username", username);

  Profile.getProfileByUsername(username, (err, results) => {
    console.log("results", res.length);
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting profile", error: err });
    }


    if (!results) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile found", profile: results });

  });
}

const createProfile = async (req, res, next) => {
  const { name, bio } = req.body;

  // Format the data
  name = name.trim();
  bio = bio.trim();

  const profile = new Profile({ name, bio });
  insertProfile(profile)
    .then((results) => {
      return true;
    })
    .catch((err) => {
      return false;
    });

}

function insertProfile (profile) {
  return new Promise((resolve, reject) => {
    Profile.createProfile(profile, (err, results) => {
      if (err) {
        console.error("Error creating profile:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


module.exports = {
  me,
  createProfile,
  insertProfile,
  getProfileByUsername
};
