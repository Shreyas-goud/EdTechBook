const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { userMiddleware } = require("../middleware/user");
const razorpayInstance = require("../utils/razorpayInstance");
const { courseModel, purchaseModel } = require("../db");

// 🟢 Route: Create Razorpay order
router.post("/create-order", userMiddleware, async (req, res) => {
  const { courseId } = req.body;
  const course = await courseModel.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const options = {
    amount: course.price * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      courseTitle: course.title,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

// 🆕 Route: Verify Razorpay Payment & Save Purchase
router.post("/verify", userMiddleware, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courseId,
  } = req.body;

  const userId = req.userId;

  // 🔐 Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  try {
    const existing = await purchaseModel.findOne({ userId, courseId });

    if (existing) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    await purchaseModel.create({
      userId,
      courseId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    res.json({ message: "Payment verified and course unlocked" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
});

module.exports = router;
