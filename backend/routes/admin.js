const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../middleware/admin");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminSignupSchema, adminSigninSchema } = require("../validators/admin");

const adminRouter = Router();

// === ADMIN SIGNUP ===
adminRouter.post("/signup", async function (req, res) {
  try {
    const parsed = adminSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(411).json({ message: errors });
    }

    const { email, password, firstName, lastName } = parsed.data;

    const existing = await adminModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
      email,
      password: hashedPw,
      firstName,
      lastName,
    });

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// === ADMIN SIGNIN ===
adminRouter.post("/signin", async function (req, res) {
  try {
    const parsed = adminSigninSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(411).json({ message: errors });
    }
    const { email, password } = parsed.data;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.json({ token });
  } catch (err) {
    console.error("Signin error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// === CREATE COURSE ===
adminRouter.post("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.userId;
    const { title, description, imageUrl, price, lessons } = req.body;

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      lessons,
      creatorId: adminId,
    });

    res.json({ message: "Course created", courseId: course._id });
  } catch (err) {
    console.error("Create course error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// === UPDATE COURSE === ✅ FIXED
adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;
  const { courseId, title, description, imageUrl, price, lessons } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Missing courseId" });
  }

  try {
    const updatedCourse = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      {
        $set: {
          title,
          description,
          imageUrl,
          price,
          lessons: lessons || [],
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res
        .status(403)
        .json({ message: "Course not found or unauthorized" });
    }

    res.json({ message: "Course updated", updatedCourse });
  } catch (err) {
    console.error("Update course error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// === DELETE COURSE ===
adminRouter.delete(
  "/course/:courseId",
  adminMiddleware,
  async function (req, res) {
    try {
      const adminId = req.userId;
      const courseId = req.params.courseId;

      const deleted = await courseModel.findOneAndDelete({
        _id: courseId,
        creatorId: adminId,
      });

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Course not found or unauthorized" });
      }

      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      console.error("Delete course error:", err);
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  }
);

module.exports = {
  adminRouter,
};
