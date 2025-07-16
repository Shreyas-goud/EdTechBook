import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CoursesNavbar from "../components/CoursesNavbar";
import { ArrowLeft } from "lucide-react";
import "./MyCourses.css";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      console.warn("User not authenticated, redirecting...");
      navigate("/");
      return;
    }

    const fetchPurchasedCourses = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/user/purchases`, {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        const data = await res.json();
        setCourses(data.coursesData || []);
      } catch (err) {
        console.error("Failed to fetch purchased courses", err);
      }
    };

    fetchPurchasedCourses();
  }, [navigate, token, BACKEND_URL]);

  return (
    <div>
      <CoursesNavbar />

      <div className="mycourses-header">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="mycourses-title">My Courses</h2>
      </div>

      <div className="mycourses-container">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isLoggedIn={true}
              showBuy={false}
              onClick={() => {
                navigate(`/course/${course._id}`);
              }}
            />
          ))
        ) : (
          <p className="empty-message">
            You haven’t purchased any courses yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyCourses;
