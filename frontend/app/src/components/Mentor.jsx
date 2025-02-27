import { Navbar2 } from "./Navbar";
import ImgMediaCard from "./Cards";
import IMG from "./images/2.png";
import IMG2 from "./images/logo.jpg";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Mentor = () => {
  const [mentors, setMentors] = useState([]);
  const { id } = useParams();

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
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Mentor;
