const mongoose = require("mongoose");

// Schema for the developer
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
// Export the model
module.exports = mongoose.model('developerSchema', developerSchema)