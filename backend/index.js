const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 3000;
env.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend URL
    credentials: true, // Allow cookies/session handling
  })
);

const server = http.createServer(app); // Already created server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure frontend is connecting to this
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for incoming messages
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("message", message); // Broadcast message to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Database connectivity
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// Models
const Message = require("./models/test");
const User = require("./models/user");
const Alumni = require("./models/alumini");

// Routes
app.get("/home", async (req, res) => {
  try {
    const message = new Message({
      text: "Hello Likhith",
    });
    await message.save();
    res.json({ success: true, message: "Data saved to database!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  const { email, phone, password, status } = req.body;

  if (!email || !phone || !password || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    if (status === "student") {
      const user = new User({
        id: id,
        email,
        phone,
        password: hash,
        status,
      });
      await user.save();
    } else {
      const user = new Alumni({
        id: id,
        email,
        phone,
        password: hash,
        status,
        // Explicitly setting empty arrays/objects
        expertise: [],
        achievements: [],
        education: [],
        experience: [],
        messagesProfiles: [],
        socialLinks: {}, // Empty object
        imageUrl: "",
        bio: "",
        accept: false,
      });
      await user.save();
    }

    res.status(200).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// Signin route
app.post("/signin", async (req, res) => {
  const { email, password, name } = req.body;
  console.log(name);

  if (name == "student") {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect password" });
      }

      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "strict",
        })
        .status(200)
        .json({ success: true, message: "Login successful", user: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  } else {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    try {
      const user = await Alumni.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect password" });
      }

      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "strict",
        })
        .status(200)
        .json({ success: true, message: "Login successful", user: user.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  }
});

// Protected route
app.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.json({ message: "Protected data", user: decoded.email });
  });
});

// Signout route
app.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logout successful" });
});

app.get("/alumini", async (req, res) => {
  try {
    const aluminiData = await Alumni.find();
    res.json(aluminiData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch alumni data" });
  }
});

const Chat = require("./models/chat");
app.post("/api/messages/send", async (req, res) => {
  try {
    const { senderId, senderType, receiverId, receiverType, message } =
      req.body;

    console.log("Request Body: ", req.body);

    if (!senderId || !senderType || !receiverId || !receiverType || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new message
    const id = uuidv4();
    const newMessage = new Chat({
      messageId: id,
      senderId,
      senderType,
      receiverId,
      receiverType,
      message, // Ensure this is 'message'
    });

    console.log("Message to Save: ", newMessage); // Log the message being saved

    // Save the message to the database
    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }, // Include reverse messages
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order

    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a message by ID
app.delete("/api/messages/delete/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    // Find and delete the message
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res
      .status(200)
      .json({ message: "Message deleted successfully", data: deletedMessage });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// mentors apis
app.get("/mentors", async (req, res) => {
  try {
    const mentors = await Alumni.find();
    if (!mentors) {
      return res.status(404).json({ error: "Mentors not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Mentors data", mentor: mentors });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/mentors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract mentor IDs from messagesProfiles
    const mentorIds = user.messagesProfiles;

    // Fetch mentor data using the IDs
    const mentors = await Alumni.find({ id: { $in: mentorIds } });
    console.log(mentors);

    res.status(200).json({
      success: true,
      message: "Mentors data retrieved successfully",
      mentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// updation of user and alumini
app.patch("/updateuserchat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { messagesProfiles } = req.body;

    // Ensure messagesProfiles is an array
    if (!Array.isArray(messagesProfiles)) {
      return res.status(400).json({
        success: false,
        message: "messagesProfiles must be an array",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: id },
      { $addToSet: { messagesProfiles: { $each: messagesProfiles } } }, // Add unique profiles
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User messagesProfiles updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user chat:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.patch("/updatealuminchat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { messagesProfiles } = req.body;

    // Ensure messagesProfiles is an array
    if (!Array.isArray(messagesProfiles)) {
      return res.status(400).json({
        success: false,
        message: "messagesProfiles must be an array",
      });
    }

    const updatedUser = await Alumni.findOneAndUpdate(
      { id: id },
      { $addToSet: { messagesProfiles: { $each: messagesProfiles } } }, // Add unique profiles
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alumni messagesProfiles updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating alumni chat:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
