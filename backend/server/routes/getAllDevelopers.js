const express = require("express");
const router = express.Router();
const developerModel = require('../models/developerModel')

// @route GET api/developer
// returns all developers
router.get('/getAll', async (req, res) => {
    const developerSchema = await developerModel.find();
    return res.json(developerSchema)
  })

  module.exports = router;