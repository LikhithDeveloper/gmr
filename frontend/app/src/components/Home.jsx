import { useContext, useEffect, useRef } from "react";
import { Navbar2 } from "./Navbar";
import { contextApi } from "./store/apis";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Home.css";

const Home = () => {
  const { liveuser } = useContext(contextApi);
  const { id, name } = useParams();
  const navigate = useNavigate();
  const featureRef = useRef(null);
  const testimonialRef = useRef(null);
  const studentcornerref = useRef(null);

  console.log(localStorage.getItem("sessionId"));
  console.log(id);

  if (JSON.parse(localStorage.getItem("sessionId")) !== id) {
    navigate("/");
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pop-up");
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }
    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }
    if (studentcornerref.current) {
      observer.observe(studentcornerref.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
      if (studentcornerref.current) {
        observer.unobserve(studentcornerref.current);
      }
    };
  }, []);

  return (
    <div>
      <Navbar2 data={{ id, name }} />
      <div className="home-1">
        <span className="home-design-1"></span>
        <span className="home-design-2"></span>
        <span className="home-design-3"></span>
        <h1
          className="home-head-1"
          style={{ fontSize: "50px", color: "#1A69F0", fontWeight: "bold" }}
        >
          Connecting Mentors & Students
        </h1>
        <p style={{ fontSize: "25px" }}>
          Building a Stronger Community Together
        </p>
        <button className="home-btn">Find Interships</button>
      </div>
      <section id="features" className="features" ref={featureRef}>
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Mentor Network</h3>
            <p>Connect with successful Mentors worldwide.</p>
          </div>
          <div className="card">
            <h3>Mentorship Programs</h3>
            <p>Get guidance from experienced professionals.</p>
          </div>
          <div className="card">
            <h3>Events & Workshops</h3>
            <p>Participate in career-building events.</p>
          </div>
        </div>
      </section>
      <section id="testimonials" className="testimonials" ref={testimonialRef}>
        <h2>What Our Mentor & Students Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"This platform helped me connect with amazing mentors!"</p>
            <p>- John Doe, Class of 2015</p>
          </div>
          <div className="testimonial">
            <p>"Great way to stay connected with my alma mater."</p>
            <p>- Jane Smith, Class of 2018</p>
          </div>
        </div>
      </section>
      <section id="students" class="students" ref={studentcornerref}>
        <h2>Student Corner</h2>
        <p>Resources, opportunities, and guidance for students.</p>
        <div class="student-links">
          <a href="#" style={{ textDecoration: "none" }}>
            Internships
          </a>
          <a href="#" style={{ textDecoration: "none" }}>
            Career Guidance
          </a>
          <a href="#" style={{ textDecoration: "none" }}>
            Mentorship
          </a>
        </div>
      </section>

      <footer>
        <p>
          &copy; 2025 Mentor Connect Mentor-Student Network. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
