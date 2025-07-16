import "./LandingPreviewCourses.css";
import { useNavigate } from "react-router-dom";

function LandingPreviewCourses() {
  const navigate = useNavigate();

  return (
    <section className="landing-preview-courses">
      <div className="preview-content">
        <h2 className="preview-heading">Explore Courses</h2>
        <p className="preview-subtext">
          A curated set of tech courses built for modern learners.
        </p>
        <img
          src="https://i.ibb.co/tM9LFGp2/Courses.png"
          alt="Courses Preview"
          className="preview-image"
        />
        <button className="preview-button" onClick={() => navigate("/courses")}>
          View Courses →
        </button>
      </div>
    </section>
  );
}

export default LandingPreviewCourses;
