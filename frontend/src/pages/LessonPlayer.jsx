import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, LogOut } from "lucide-react";
import "./LessonPlayer.css";

function LessonPlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Fetch course
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${BACKEND_URL}/api/v1/course/${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const resolved = data.course || data.courseData;
        if (resolved) {
          setCourse(resolved);
          setSelectedVideo(resolved.lessons?.[0] || null);
        } else {
          console.error("Unexpected response", data);
        }
      })
      .catch((err) => {
        console.error("Failed to load course", err);
      });
  }, [courseId, token, navigate, BACKEND_URL]);

  // Scroll to top when video changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedVideo]);

  const handleLessonClick = (lesson) => {
    if (selectedVideo?.title === lesson.title) {
      setSelectedVideo(null); // simulate pause
      setTimeout(() => setSelectedVideo(lesson), 50); // resume
    } else {
      setSelectedVideo(lesson);
    }

    fetch(`${BACKEND_URL}/api/v1/course/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        courseId,
        lesson: {
          title: lesson.title,
          videoUrl: lesson.videoUrl,
        },
      }),
    }).catch((err) => {
      console.error("Failed to save lesson progress", err);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!course) {
    return (
      <div className="lesson-player-container">
        <p style={{ textAlign: "center", marginTop: "100px" }}>
          Loading course...
        </p>
      </div>
    );
  }

  return (
    <div className="lesson-player-container">
      {/* === NAVBAR === */}
      <div className="lesson-player-navbar">
        <div
          className="lesson-navbar-left"
          onClick={() => navigate("/my-courses")}
        >
          <ArrowLeft size={20} style={{ marginRight: "8px" }} />
          <span className="lesson-brand">EdTechBook</span>
        </div>

        <div className="lesson-navbar-title">{course.title}</div>

        <div className="lesson-navbar-right">
          <LogOut
            size={20}
            className="lesson-logout-icon"
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>

      <div className="lesson-body">
        {/* === SIDEBAR === */}
        <div className={`lesson-sidebar ${sidebarVisible ? "visible" : ""}`}>
          <div className="lesson-sidebar-header">
            <Menu
              className="lesson-sidebar-toggle"
              onClick={() => setSidebarVisible(false)}
              title="Close lessons"
            />
          </div>

          {course.lessons?.map((lesson, idx) => (
            <div
              key={idx}
              className={`lesson-item ${
                selectedVideo?.title === lesson.title ? "active" : ""
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              {lesson.title}
            </div>
          ))}
        </div>

        {/* === TOGGLE SIDEBAR ICON === */}
        {!sidebarVisible && (
          <Menu
            className="lesson-sidebar-toggle floating"
            onClick={() => setSidebarVisible(true)}
            title="Show lessons"
          />
        )}

        {/* === VIDEO CONTENT === */}
        <div className="lesson-video-content">
          {selectedVideo ? (
            <iframe
              className="lesson-video-frame"
              src={selectedVideo.videoUrl}
              title={selectedVideo.title}
              allowFullScreen
            ></iframe>
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Select a lesson to play
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPlayer;
