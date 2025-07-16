const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  try {
    const existingPurchase = await purchaseModel.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    await purchaseModel.create({
      userId,
      courseId,
    });

    res.json({
      message: "You have successfully bought the course",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

courseRouter.post("/progress", userMiddleware, async (req, res) => {
  const { courseId, lesson } = req.body;
  const userId = req.userId;

  try {
    const purchase = await purchaseModel.findOne({ userId, courseId });
    if (!purchase) {
      return res.status(404).json({ message: "Course not purchased" });
    }

    purchase.lastWatched = lesson;
    await purchase.save();

    res.json({ message: "Progress saved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save progress" });
  }
});

courseRouter.get("/preview/:id", async function (req, res) {
  const course = await courseModel.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({ course });
});

courseRouter.get("/preview", async function (req, res) {
  try {
    const courses = await courseModel.find({});
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Failed to load courses" });
  }
});

courseRouter.get("/:courseId", userMiddleware, async (req, res) => {
  const course = await courseModel.findById(req.params.courseId);
  const purchase = await purchaseModel.findOne({
    courseId: req.params.courseId,
    userId: req.userId,
  });

  if (!purchase) {
    return res.status(403).json({ message: "You haven’t bought this course" });
  }

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ course });
});

module.exports = {
  courseRouter: courseRouter,
};
