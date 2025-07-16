import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CoursesNavbar from "../components/CoursesNavbar";
import "./Courses.css";
import { toast } from "react-toastify";
import { getAuthHeader } from "../utils/auth";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/course/preview`);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }

      if (isLoggedIn) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/user/purchases`, {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
          });
          const data = await res.json();
          const ids = (data.purchases || []).map((p) => p.courseId);
          setPurchasedIds(ids);
        } catch (err) {
          console.error("Error fetching purchases:", err);
        }
      }
    };

    fetchData();
  }, [isLoggedIn, token, BACKEND_URL]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async (courseId) => {
    if (!isLoggedIn) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", {
          detail: { type: "signin" },
        })
      );
      return;
    }

    const success = await loadRazorpayScript();
    if (!success) {
      toast.error("Failed to load Razorpay");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Could not start payment");
        return;
      }

      const { orderId, amount, currency, courseTitle, key } = data;

      const options = {
        key,
        amount,
        currency,
        name: "EdTechBook",
        description: courseTitle,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${BACKEND_URL}/api/v1/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...getAuthHeader(),
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              toast.error(verifyData.message || "Verification failed");
              return;
            }

            toast.success("Payment successful! Course unlocked.");
            setPurchasedIds((prev) => [...prev, courseId]);
            navigate("/my-courses");
          } catch (err) {
            toast.error("Error verifying payment");
            console.error("Verification failed", err);
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#3f51b5",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment failed", err);
      toast.error("Payment initiation failed");
    }
  };

  const handleCourseClick = (courseId) => {
    if (purchasedIds.includes(courseId)) {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div>
      <CoursesNavbar />
      <div className="hero-section-courses">
        <h1>Explore Our Courses</h1>
      </div>

      <div className="courses-container">
        {courses.length ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isLoggedIn={isLoggedIn}
              showBuy={!purchasedIds.includes(course._id)}
              onBuy={() => handleBuy(course._id)}
              onClick={() => handleCourseClick(course._id)}
            />
          ))
        ) : (
          <p>No available courses.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
