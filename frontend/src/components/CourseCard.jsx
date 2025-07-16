// src/components/CourseCard.jsx
import "./CourseCard.css";

function CourseCard({ course, isLoggedIn, showBuy, onBuy, onClick }) {
  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-thumbnail">
        <img
          src={course.imageUrl}
          alt={course.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/280x160?text=No+Image";
          }}
        />
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-footer">
          {!showBuy ? (
            <span className="purchased-label">View Your Course </span>
          ) : (
            <>
              <span className="course-price">₹{course.price}</span>
              {isLoggedIn && (
                <button
                  className="buy-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuy();
                  }}
                >
                  Buy
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
