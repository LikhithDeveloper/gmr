const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  senderId: { type: String, required: true }, // Change this to String
  senderType: { type: String, enum: ["User", "Alumni"], required: true },
  receiverId: { type: String, required: true }, // Change this to String
  receiverType: { type: String, enum: ["User", "Alumni"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", ChatSchema);
