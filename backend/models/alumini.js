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
    index: true, // Enables searching by name
  },
  batch: {
    type: Number,
    required: false,
    index: true, // Enables filtering by batch
  },
  company: {
    type: String,
    required: false,
    index: true, // Enables searching/filtering by company
  },
  expertise: {
    type: [String], // Array of skills/expertise
    required: false,
    index: true, // Enables filtering by skills
  },
  industry: {
    type: String,
    required: false,
    index: true, // Enables filtering by industry
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
    type: [String], // List of achievements
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
    type: String, // Alumni success story or featured content
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
  accept: {
    type: Boolean,
    required: false,
    default: false, // Default value is false (not accepted)
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

const Alumni = mongoose.model("Alumni", alumniSchema);
module.exports = Alumni;
