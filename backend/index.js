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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

const server = http.createServer(app); // Already created server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Ensure frontend is connecting to this
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   },
// });
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }, // Allow frontend access
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
    console.log(`${senderId} joined room ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    const roomId = [data.senderId, data.receiverId].sort().join("_");
    io.to(roomId).emit("receiveMessage", {
      senderId: data.senderId,
      text: data.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
app.use(bodyParser.json());
app.use(cookieParser());

// Database connectivity
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// Models
// const Message = require("./models/test");
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
      text: message, // Ensure this is 'message'
    });

    console.log("Message to Save: ", newMessage);

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

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

    const user = await User.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mentorIds = user.messagesProfiles;
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

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Alumni.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mentorIds = user.messagesProfiles;
    const mentors = await User.find({ id: { $in: mentorIds } });
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

app.patch("/updateuserchat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { messagesProfiles } = req.body;

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
    if (!Array.isArray(messagesProfiles)) {
      return res.status(400).json({
        success: false,
        message: "messagesProfiles must be an array",
      });
    }

    const updatedUser = await Alumni.findOneAndUpdate(
      { id: id },
      { $addToSet: { messagesProfiles: { $each: messagesProfiles } } },
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

const Club = require("./models/clubs");

app.post("/clubs", async (req, res) => {
  try {
    const { club, mentor, description, users, meetDate } = req.body;
    const id = uuidv4();
    const newClub = new Club({
      id: id,
      club,
      mentor,
      description,
      link: users,
      date: meetDate,
    });
    await newClub.save();
    res
      .status(201)
      .json({ message: "Club created successfully", club: newClub });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating club", error: error.message });
  }
});

app.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching clubs", error: error.message });
  }
});

app.get("/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findOne({ id: req.params.id });
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching club", error: error.message });
  }
});

app.patch("/club/:id/:user", async (req, res) => {
  const { id, user } = req.params; // Get club id and user id from params
  const users = [user]; // Wrapping the user into an array to use `$addToSet`

  console.log("Club ID:", id);
  console.log("User ID:", user);

  try {
    // Find club by ID and update the users array
    const club = await Club.findOneAndUpdate(
      { id }, // Find club by custom 'id' field
      {
        $addToSet: { users: { $each: users } }, // Add the user to the users array without duplicates
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Return the updated club object
    res.status(200).json(club);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// mentor update

// PATCH route to update fields except email, password, and phone
app.patch("/alumni/:id", async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body; // Expecting 'rating' field to be passed

  try {
    // Find the alumni by ID and update the rating
    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Update the review field with the new rating
    alumni.review = rating;

    await alumni.save();

    res.status(200).json({ success: true, alumni });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
