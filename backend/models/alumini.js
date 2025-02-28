const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    index: true,
  },
  batch: {
    type: Number,
    required: false,
    index: true,
  },
  company: {
    type: String,
    required: false,
    index: true,
  },
  expertise: {
    type: [String],
    required: false,
    index: true,
  },
  industry: {
    type: String,
    required: false,
    index: true,
  },
  education: {
    type: [
      {
        institution: String,
        degree: String,
        year: Number,
      },
    ],
    required: false,
  },
  experience: {
    type: [
      {
        company: String,
        position: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    required: false,
  },
  achievements: {
    type: [String],
    required: false,
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
  successStory: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  accept: {
    type: Boolean,
    required: false,
    default: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },

  review: {
    type: Number,
    required: false,
  },

  messagesProfiles: {
    type: [String],
    required: false,
  },
});

const Alumni = mongoose.model("Alumni", alumniSchema);
module.exports = Alumni;
