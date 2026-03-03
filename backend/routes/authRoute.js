const express = require("express");
const {
  register,
  login,
  technician,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/technician", technician);

module.exports = router;
