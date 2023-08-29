const jwt = require("jsonwebtoken"); // Correct variable name for JWT library
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select("-password");
      req.user = user;
      next();
    } catch (error) {
      const err = new Error("Unauthorized");
      err.status = 401;
      next(err);
    }
  } else {
    const err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
};

module.exports = authMiddleware;
