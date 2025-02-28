import { Navbar2 } from "./Navbar";
import ImgMediaCard from "./Cards";
import IMG from "./images/2.png";
import IMG2 from "./images/logo.jpg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const { id } = useParams();
  const [feed, setFeed] = useState();

  useEffect(() => {
    async function fetchMentorData() {
      try {
        const response = await fetch(`http://localhost:3000/mentors`);
        const data = await response.json();
        if (data.success) {
          console.log(data.mentor);
          setMentors(data.mentor);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    }

    fetchMentorData();
  }, []);

  function handelFeedback(e) {
    e.preventDefault();
    const dataid = e.target.rate.value;
  }

  return (
    <>
      <Navbar2 />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "start",
          alignItems: "start",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "20px",
          padding: "70px 30px",
        }}
      >
        {mentors.length === 0 ? (
          <p>Loading mentors...</p>
        ) : (
          mentors.map((mentor, index) => (
            <ImgMediaCard
              key={index}
              image={{
                img: mentor.imageUrl || IMG,
                email: mentor.email,
                mentorid: mentor.id,
                userId: id,
                setFeed,
              }}
            />
          ))
        )}
        <div
          className="feed-form"
          style={{
            width: "280px",
            height: "100px",
            background: "white",
            position: "absolute",
            top: "300px",
            left: "35%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <form onSubmit={() => handelFeedback()}>
            <input name="rate" type="number"></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Mentor;
