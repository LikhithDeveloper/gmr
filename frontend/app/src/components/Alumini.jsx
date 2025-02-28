import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./styles/Alumni.css";
import { Navbar2 } from "./Navbar";
import myimg from "./images/2.png";
import SendIcon from "@mui/icons-material/Send";
import GMR from "./images/Picsart_25-02-28_00-17-32-366-removebg-preview.png";
import { useParams, useNavigate } from "react-router-dom";
import ForumIcon from "@mui/icons-material/Forum";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateClubModal from "./CreateClubModal";

const socket = io("http://localhost:3000");

const Alumni = () => {
  const [profile, setProfile] = useState([]);
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const { name, id } = useParams();
  const [chatData, setChatData] = useState([]);
  const chatRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("sessionId")) !== id) {
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinRoom", { senderId: id, receiverId: chatId });
      socket.on("receiveMessage", (newMessage) => {
        setChatData((prevChat) => [...prevChat, newMessage]);
      });
    }
    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleForm = async (e) => {
    e.preventDefault();
    const message = e.target.msg.value.trim();
    if (!message) return;

    const payload = {
      senderId: id,
      senderType: name === "student" ? "User" : "Alumni",
      receiverId: chatId,
      receiverType: name === "student" ? "Alumni" : "User",
      message: message,
    };

    socket.emit("sendMessage", payload);
    setChatData((prevChat) => [...prevChat, payload]);

    try {
      const response = await fetch("http://localhost:3000/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    e.target.reset();
  };

  useEffect(() => {
    async function getChats() {
      try {
        const response = await fetch(
          name === "student"
            ? `http://localhost:3000/mentors/${id}`
            : `http://localhost:3000/users/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setProfile(data.mentors || []);
        } else {
          alert("Internal server Error");
        }
      } catch (error) {
        alert("Error fetching mentor data");
      }
    }
    getChats();
  }, [id]);

  async function getChat(chatid) {
    setChatId(chatid);
    try {
      const url = `http://localhost:3000/api/messages/${id}/${chatid}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setChatData(data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  return (
    <>
      <Navbar2 />
      <div className="alumini-main">
        <div className="alumini-chat-1">
          <div className="alumini-chat-1-inner">
            {profile.length > 0 ? (
              profile.map((chats, index) => (
                <div
                  key={index}
                  className="alumini-chat-1-profile"
                  onClick={() => getChat(chats.id)}
                >
                  <img
                    src={myimg}
                    alt="Profile"
                    style={{ width: "40px", borderRadius: "50%" }}
                  />
                  <h6>{chats.email.split("@")[0]}</h6>
                </div>
              ))
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>

        <div className="alumini-chat-2">
          <div className="alumini-chat-2-inner">
            {chatId ? (
              <>
                {profile
                  .filter((chat) => chat.id === chatId)
                  .map((selectedChat) => (
                    <span className="chat-name" key={selectedChat.id}>
                      {selectedChat.email.split("@")[0]}
                    </span>
                  ))}
                <span>
                  <img src={GMR} style={{ width: "300px" }} alt="Logo" />
                </span>
                <div className="chat-box" ref={chatRef}>
                  {chatData.map((ele, key) =>
                    ele.text ? (
                      <li
                        className={ele.senderId === id ? "right-li" : "left-li"}
                        key={key}
                      >
                        {ele.text}
                      </li>
                    ) : null
                  )}
                </div>

                <div className="chat-box-form">
                  <form onSubmit={handleForm}>
                    <input
                      name="msg"
                      type="text"
                      placeholder="Type a message"
                    />
                    <button type="submit">
                      <SendIcon style={{ color: "blue" }} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div>
                <ForumIcon style={{ fontSize: "100px", opacity: "0.5" }} />
                <p>Start messaging</p>
              </div>
            )}
          </div>
        </div>
        <div className="alumini-post">
          <div className="alumini-post-inner">
            <h3>Add Clubs</h3>
            <div className="club-form" onClick={handleShowModal}>
              <AddCircleOutlineIcon style={{ fontSize: "100px" }} />
            </div>
            <h3>Add Post</h3>
            <div className="club-form" onClick={handleShowModal}>
              <AddCircleOutlineIcon style={{ fontSize: "100px" }} />
            </div>
          </div>

          {/* Render Modal if showModal is true */}
          {showModal && (
            <CreateClubModal show={showModal} handleClose={handleCloseModal} />
          )}
        </div>
      </div>
    </>
  );
};

export default Alumni;
