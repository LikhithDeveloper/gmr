import React, { useState, useEffect, useRef } from "react";
import "./styles/Alumni.css";
import { Navbar2 } from "./Navbar";
import myimg from "./images/2.png";
import SendIcon from "@mui/icons-material/Send";
import GMR from "./images/Picsart_25-02-28_00-17-32-366-removebg-preview.png";
import { useParams, useNavigate } from "react-router-dom";
import ForumIcon from "@mui/icons-material/Forum";

const Alumni = () => {
  const [msg, setMsg] = useState([]);
  const [profile, setProfile] = useState([]); // Initialize as an empty array
  const [chatId, setChatId] = useState(null); // Rename 'chat' to 'chatId' to avoid conflict
  const navigate = useNavigate();
  const { name, id } = useParams();

  // Check session ID
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("sessionId")) !== id) {
      navigate("/");
    }
  }, [id, navigate]);

  // Handle form submission
  const handleForm = (e) => {
    e.preventDefault();
    const newmsg = e.target.msg.value;
    setMsg((prevMsg) => [...prevMsg, newmsg]);
    e.target.msg.value = "";
  };

  // Scroll chat to bottom
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [msg]);

  // Fetch chats and profile data
  useEffect(() => {
    async function getChats() {
      try {
        const response = await fetch(`http://localhost:3000/mentors/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data.mentors);
          setProfile(data.mentors || []); // Ensure 'mentors' exists and is an array
        } else {
          alert("Internal server Error");
        }
      } catch (error) {
        alert("Error fetching mentor data");
      }
    }

    getChats(); // Call the function to fetch data
  }, [id]);

  // Prevent page reload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for some browsers
    };

    // Add event listener to prevent reload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Navbar2 />
      <div className="alumini-main">
        <div className="alumini-chat-1">
          <div className="alumini-chat-1-inner">
            {Array.isArray(profile) && profile.length > 0 ? (
              profile.map((chats, index) => (
                <div
                  key={index}
                  className="alumini-chat-1-profile"
                  onClick={() => setChatId(chats.id)} // Change chat to chatId
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
              <p>Loading profile...</p> // Show a loading message while fetching data
            )}
          </div>
        </div>
        <div className="alumini-chat-2">
          <div className="alumini-chat-2-inner">
            {chatId ? (
              <>
                {profile
                  .filter((chat) => chat.id === chatId) // Use the filtered chatId
                  .map((selectedChat) => (
                    <span className="chat-name" key={selectedChat.id}>
                      {selectedChat.email.split("@")[0]}
                    </span>
                  ))}
                <span>
                  <img src={GMR} style={{ width: "300px" }} alt="Logo" />
                </span>
                <div className="chat-box" ref={chatRef}>
                  {msg.map((ele, key) => (
                    <li key={key}>{ele}</li>
                  ))}
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
              </div> // Show message when there is no chat
            )}
          </div>
        </div>
        <div className="alumini-post"></div>
      </div>
    </>
  );
};

export default Alumni;
