const mongoose = require("mongoose");

const user = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  socialLinks: {
    type: Map,
    of: String,
    required: false,
  },
  messagesProfiles: {
    type: [String],
    required: false,
  },
});

const User = mongoose.model("User", user);
module.exports = User;
