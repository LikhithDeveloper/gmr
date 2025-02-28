import "./styles/Navbar.css";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate, useParams } from "react-router-dom";
import { contextApi } from "./store/apis";
import { useContext } from "react";
import gmr from "./images/Picsart_25-02-28_00-17-32-366-removebg-preview.png";

export const Navbar1 = () => {
  const navigation = useNavigate();
  const { name } = useParams();

  return (
    <>
      <nav>
        <div className="logo">
          {/* <h2 style={{ color: "rgb(26, 105, 240)" }}>LOGO</h2> */}
          <img
            src={gmr}
            style={{ width: "130px", cursor: "pointer" }}
            onClick={() => navigation("/")}
          ></img>
        </div>
        <div className="profile">
          {/* <button onClick={() => navigation("/signin/")}>
            <LoginRoundedIcon
              style={{ fontSize: "18px", marginRight: "7px" }}
            />
            SignIn
          </button> */}
          <button onClick={() => navigation("/signup/")}>
            <PersonAddAltRoundedIcon
              style={{ fontSize: "20px", marginRight: "7px" }}
            />
            SignUp
          </button>
          {/* <AccountCircleRoundedIcon
            className="profile-icon"
            style={{ fontSize: "30px", cursor: "pointer" }}
          /> */}
        </div>
      </nav>
    </>
  );
};

export const Navbar2 = ({ data }) => {
  const navigate = useNavigate();
  const { setLiveUser } = useContext(contextApi);
  const handleLogout = async () => {
    localStorage.removeItem("sessionId");
    navigate("/");
  };
  // const id = data?.id;
  // const name = data?.name;
  const { id, name } = useParams();

  return (
    <>
      <nav>
        <div className="logo">
          {/* <h2>LOGO</h2> */}
          <img
            src={gmr}
            style={{ width: "130px", cursor: "pointer" }}
            onClick={() => navigation(`/`)}
          ></img>
        </div>
        <div className="profile">
          <Link className="link" to={`/home/${name}/${id}`}>
            HOME
          </Link>
          <Link className="link" to="/home">
            POSTS
          </Link>
          <Link className="link" to="/products">
            JOBS
          </Link>
          <Link className="link" to={`/clubs/${name}/${id}`}>
            CLUBS
          </Link>
          {name == "student" ? (
            <Link className="link" to={`/mentor/${name}/${id}`}>
              MENTORS
            </Link>
          ) : null}
          {name == "alumini" ? <Link className="link">PROFILE</Link> : null}

          <EmailIcon
            onClick={() => navigate(`/profile/${name}/${id}`)}
            className="profile-icon"
            style={{ fontSize: "30px", cursor: "pointer" }}
          ></EmailIcon>
          <button onClick={handleLogout}>
            <LogoutIcon style={{ fontSize: "18px", marginRight: "7px" }} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};
