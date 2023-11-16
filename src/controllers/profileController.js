const User = require("../models/User");
const Profile = require("../models/Profile");

require("dotenv").config();

// Return the user data from the token
const me = async (req, res, next) => {

  Profile.getUserProfileByUuid(req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "User found", user: results });
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
  insertProfile
};
