import { useState } from "react";
import { Navbar1 } from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Registration.css";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

export const Registration = () => {
  const navigate = useNavigate();
  const handelForm = async (e) => {
    e.preventDefault();

    // Capture form values
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const confirmPassword = e.target["confirmpassword"].value;
    const status = e.target.status.value;
    console.log(status);

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send form data to the backend
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify({
          email,
          phone,
          password,
          status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("SIGNUP Successful");
        navigate("/");
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      alert("Error during signup: " + err.message);
    }

    // Clear form fields
    e.target.email.value = "";
    e.target.phone.value = "";
    e.target.password.value = "";
    e.target.confirmpassword.value = "";
    e.target.status.value = "";
  };

  return (
    <div>
      <Navbar1 />
      <div className="register">
        <div className="registration-form">
          <PersonOutlineRoundedIcon style={{ fontSize: "50px" }} />
          <h5>SIGNUP HERE!</h5>
          <form onSubmit={handelForm}>
            <label>Email:</label>
            <br />
            <input type="email" id="email" name="email" required />
            <br />
            <label>Mobile Number:</label>
            <br />
            <input type="text" id="phone" name="phone" />
            <br />
            <label>Password:</label>
            <br />
            <input type="password" id="password" name="password" required />
            <br />
            <label>Confirm Password:</label>
            <br />
            <input
              type="password"
              id="confirm-password"
              name="confirmpassword"
              required
            />
            <br></br>
            <label>Select status:</label>
            <br></br>
            <select id="status" name="status">
              <option></option>
              <option value="student">Student</option>
              <option value="alumini">Alumini</option>
            </select>
            <br />
            <br />
            <button type="submit" id="register-button">
              SignUp
            </button>
          </form>
          <Link to="/" style={{ margin: "10px" }}>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};
