const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const newUserModel = require("../models/userModel");

// @route GET api/user
// returns user by id
router.get("/getUserById", async (req, res) => {
  var { userId } = req.body;

  // validate input
  newUserModel.findById(userId, function (err, user) {
    if (err) {
      console.log(err);
    }
    // if user does not exist, return error
    if (user==null) {
      res.status(404).send("userId does not exist.");
    } 
    // if user exists, return user
    else {
      return res.json(user);
    }
  });
});

module.exports = router;
