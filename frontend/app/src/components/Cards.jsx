import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";

const ImgMediaCard = ({ image }) => {
  const { img, email, mentorid, userId, toggleFormVisibility } = image; // Ensure 'image' contains the right data
  const { id } = useParams(); // Get 'id' from the URL parameters

  async function updateUserChat(userId, mentorid) {
    console.log(userId, mentorid);
    if (!userId || !mentorid) {
      console.error("Invalid userId or mentorid");
      return;
    }

    try {
      // Update the user's chat with the mentor's profile
      const response1 = await fetch(
        `http://localhost:3000/updateuserchat/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messagesProfiles: [mentorid] }), // Ensure 'messagesProfiles' is passed
        }
      );

      const response2 = await fetch(
        `http://localhost:3000/updatealuminchat/${mentorid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messagesProfiles: [userId] }), // Ensure 'messagesProfiles' is passed
        }
      );

      // Send initial message after updating chats
      await SendInitial(mentorid);

      console.log("User messagesProfiles updated successfully:", data1);
    } catch (error) {
      console.error("Error updating user chat:", error.message);
    }
  }

  const name = email.split("@")[0];

  // Function to send initial message to the mentor
  async function SendInitial(mentorId) {
    console.log("------", mentorId);
    try {
      const response = await fetch("http://localhost:3000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: id,
          senderType: "User",
          receiverId: mentorId,
          receiverType: "Alumni",
          message: "Hi",
        }),
      });

      // Check if the response is OK and contains JSON
      if (!response.ok) {
        throw new Error(
          "Failed to send message, server responded with status " +
            response.status
        );
      }

      // Check if the response body is empty
      if (
        response.status !== 204 &&
        response.headers.get("Content-Type")?.includes("application/json")
      ) {
        const data = await response.json();
        console.log("Message sent successfully:", data);
        alert("Message sent successfully");
      } else {
        console.log("No content received");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  function set() {
    setFeed(mentorid);
    toggleFormVisibility();
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" alt={name} height="190" image={img} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Likhith is a passionate web developer and AI enthusiast pursuing a
          BTech in Computer Science with a focus on AI & ML at AITAM.
        </Typography>
        <Rating
          name="simple-uncontrolled"
          onChange={(event, newValue) => {
            console.log(newValue);
          }}
          defaultValue={4}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => updateUserChat(userId, mentorid)}>
          Reach Me
        </Button>
        <Button size="small" onClick={set}>
          Know Me
        </Button>
      </CardActions>
    </Card>
  );
};

export default ImgMediaCard;
