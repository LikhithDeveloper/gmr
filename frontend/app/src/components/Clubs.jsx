import { useEffect, useState } from "react";
import { Navbar2 } from "./Navbar";
import "./styles/Clubs.css";
import { useParams } from "react-router-dom";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const { id } = useParams();

  // Trigger re-fetching of clubs when a club is added
  const [inc, setInc] = useState(0);

  useEffect(() => {
    async function GetClubs() {
      try {
        const data = await fetch("http://localhost:3000/clubs");
        const response = await data.json();
        console.log(response);
        setClubs(response);
      } catch (error) {
        console.log(error);
      }
    }
    GetClubs();
  }, [inc]);

  function Addclub(clubid) {
    try {
      fetch(`http://localhost:3000/club/${clubid}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Updated Club:", data);
          alert("Added successfully");
          // Triggering re-fetch of clubs by updating state
          setInc(inc + 1); // Incrementing `inc` will trigger the effect to re-fetch clubs
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function isToday(dateString) {
    const today = new Date();
    const clubDate = new Date(dateString);
    return (
      today.getDate() === clubDate.getDate() &&
      today.getMonth() === clubDate.getMonth() &&
      today.getFullYear() === clubDate.getFullYear()
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="club-main">
        {clubs.map((ele, index) => (
          <div className="clubs-card" key={index}>
            <h3>{ele.club}</h3>
            <p>{ele.description}</p>
            <p>Session By :- {ele.mentor}</p>
            {isToday(ele.date) ? (
              // Only show link if the user is part of the club
              ele.users.includes(id) && (
                <p>
                  Link available at:{" "}
                  <a href={ele.link} target="_blank" rel="noopener noreferrer">
                    {ele.link}
                  </a>
                </p>
              )
            ) : (
              <p>Session Date: {new Date(ele.date).toLocaleDateString()}</p> // Displaying formatted date
            )}
            {ele.users.includes(id) ? (
              <button className="club-btn" disabled>
                Booked
              </button>
            ) : (
              <button className="club-btn" onClick={() => Addclub(ele.id)}>
                Add club
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Clubs;
