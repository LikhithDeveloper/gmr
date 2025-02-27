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
    required: false, // URL for profile image
  },
  bio: {
    type: String,
    required: false, // Short biography or about section
  },
  socialLinks: {
    type: Map,
    of: String,
    required: false, // Social media links like LinkedIn, Twitter, etc.
  },
  messagesProfiles: {
    type: [String],
    required: false,
  },
});

const User = mongoose.model("User", user);
module.exports = User;
