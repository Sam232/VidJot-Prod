const mongoose = require("mongoose");

var IdeaSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

var Ideas = mongoose.model("Ideas", IdeaSchema);

module.exports = {Ideas};