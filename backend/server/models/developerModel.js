const mongoose = require("mongoose");

//user schema/model
const developerSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      label: "first name",
    },
    lName: {
      type: String,
      required: true,
      label: "Last Name",
    },
    projDescription: {
        type: String,
        required: true,
        label: "Description of sections worked on"
    }

  },
  { collection: "developerSchema" }
);

module.exports = mongoose.model('developerSchema', developerSchema)