const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).json({ message: "Admin token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid admin token" });
  }
}

module.exports = {
  adminMiddleware,
};
