const express = require("express");
const router = express.Router();
const newUserModel = require('../models/userModel')

// @route GET api/user
// returns all users
router.get('/getAll', async (req, res) => {
    const user = await newUserModel.find();
    return res.json(user)
  })

  module.exports = router;