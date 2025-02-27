import { Navbar1 } from "./Navbar";
import "./styles/Registration.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { contextApi } from "./store/apis";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { useContext, useEffect } from "react";

export const Login = () => {
  const navigate = useNavigate();
  const { liveuser, setLiveUser, fetchProtectedData } = useContext(contextApi);
  const { name } = useParams();
  const handelForm = async (e) => {
    e.preventDefault();

    // Capture form values
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email);
    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        alert("Signin successfull");
        // fetchProtectedData();
        localStorage.setItem("sessionId", JSON.stringify(data.user));
        console.log(`/home/${name}/${data.user}`);
        navigate(`/home/${name}/${data.user}`);
      } else {
        alert("Signin failed");
      }
    } catch (error) {
      alert("Error during signin: " + error.message);
    }
    e.target.email.value = "";
    e.target.password.value = "";
  };
  return (
    <div>
      <Navbar1 />
      <div className="register">
        <div className="registration-form">
          <PersonOutlineRoundedIcon style={{ fontSize: "50px" }} />
          <h5>SIGNIN HERE!</h5>
          <form onSubmit={handelForm}>
            <label>Email:</label>
            <br></br>
            <input type="email" id="email"></input>
            <br></br>
            {/* <label>Mobile Number:</label>
            <br></br>
            <input type="text" id="email"></input>
            <br></br> */}
            <label>Password:</label>
            <br></br>
            <input type="password" id="password"></input>
            <br></br>
            {/* <label>Confirm Password:</label>
            <br></br>
            <input type="password" id="confirm-password"></input> */}
            {/* <br></br> */}
            <br></br>
            <button type="submit" id="register-button">
              SignIn
            </button>
          </form>
          <Link to="/signup" style={{ margin: "10px" }}>
            Create new account?
          </Link>
        </div>
      </div>
    </div>
  );
};
