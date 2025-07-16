require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3002"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/order", orderRoutes);
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(3000, () => {
    console.log("Backend running on port 3000");
  });
}

main();
