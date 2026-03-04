const express = require("express");
const {
  register,
  login,
  technician,
  Leave,
  admin,
} = require("../controllers/authController");
const { protected, authorize } = require("../middleware/authmiddleware");
const leave = require("../models/leave");
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/technician", protected, technician);
router.post("/leave", protected, Leave);
router.get("/admin", protected, authorize("Supervisor", "Team Leader"), admin);
module.exports = router;
