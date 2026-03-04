const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protected = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      return res.json({ message: "no headers provided" });
    }
    const token = authHeaders.split(" ")[1];
    const decode = jwt.verify(token, process.env.secret_key);
    req.user = decode;
  } catch (error) {
    console.log(error);
  }
  next();
};

exports.authorize =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(500).json({ message: req.user.role });
    }
    next();
  };
