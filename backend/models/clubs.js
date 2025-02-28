const mongoose = require("mongoose");

const club = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  club: {
    type: String,
    required: true,
  },
  mentor: {
    type: String,
    required: true,
  },
  users: {
    type: [String],
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
});

const Club = mongoose.model("Club", club);
module.exports = Club;
