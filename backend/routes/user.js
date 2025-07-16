const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const userRouter = Router();
const { signupSchema, signinSchema } = require("../validators/user");

userRouter.post("/signup", async function (req, res) {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(411).json({ message: errors });
    }

    const { email, password, firstName, lastName } = parsed.data;

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPw,
      firstName,
      lastName,
    });

    res.json({ message: "Signup succeeded" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

userRouter.post("/signin", async function (req, res) {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(411).json({ message: errors });
    }

    const { email, password } = parsed.data;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter,
};
