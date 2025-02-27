import { Navbar1 } from "./Navbar";
import "./styles/Main.css";
import img1 from "./images/index.svg";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar1></Navbar1>
      <div className="first-page">
        <div style={{ flexDirection: "column" }}>
          <span className="design"></span>
          <h1 className="head-para">MENTOR Connect</h1>
          <p
            className="head-para"
            style={{ textAlign: "center", width: "80%", fontWeight: "700" }}
          >
            A smart networking platform that bridges Mentors and students for
            mentorship, career guidance, and collaboration.
          </p>
          <div
            style={{
              width: "200px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="first-btn"
              onClick={() => navigate("/signin/alumini")}
            >
              Alumini
            </button>
            <button
              className="first-btn"
              onClick={() => navigate("/signin/student")}
            >
              Student
            </button>
          </div>
          <p
            className="head-para"
            style={{
              margin: "15px",
              fontSize: "14px",
              color: "rgb(26, 105, 240)",
            }}
          >
            If you don't have an account please click on SignUp
          </p>
        </div>
        <div>
          <span className="right-design"></span>
          <img
            className="head-para"
            src={img1}
            style={{ width: "500px" }}
          ></img>
        </div>
      </div>
    </>
  );
};
export default Main;
