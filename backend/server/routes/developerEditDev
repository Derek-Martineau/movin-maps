const express = require("express");
const router = express.Router();
const developerModel = require('../models/developerModel');
const { generateAccessToken } = require('../utilities/generateToken');

router.post('/editDeveloper', async (req, res) =>
{
    // store developer information
    const {developerId, fName, lName, projDescription} = req.body;

    // check if developer exists
    const developer = await developerModel.findById(developerId);
    if (!developer) return res.status(404).send({ message: "Developer not found" });

    // find and update developer using stored information
    developerModel.findByIdAndUpdate(developerId, {
        fName: fName,
        lName: lName, 
        projDescription: projDescription
    } ,function (err, developer) {
    if (err){
        console.log(err);
    } else {
        // create and send new access token to local storage
        const accessToken = generateAccessToken(developer._id, developer.fName, developer.lName, developer.projDescription);
        res.header('Authorization', accessToken).send({ message: "Developer information updated successfully", accessToken: accessToken });
    }
    });

});

module.exports = router;