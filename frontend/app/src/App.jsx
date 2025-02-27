import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Apis } from "./components/store/apis";
import Home from "./components/Home";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import Main from "./components/Main";
import Alumni from "./components/Alumini";
import io from "socket.io-client";
import Mentor from "./components/Mentor";

const socket = io("http://localhost:3000");

function App() {
  return (
    <Apis>
      <Router>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/home/:name/:id" element={<Home />} />
          <Route path="/signin/:name" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/profile/:name/:id" element={<Alumni />} />
          <Route path="/mentor/:name/:id" element={<Mentor />} />
        </Routes>
      </Router>
    </Apis>
  );
}

export default App;
