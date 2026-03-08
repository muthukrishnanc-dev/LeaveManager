const express = require("express");
const {
  register,
  login,
  technician,
  Leave,
  admin,
  approve,
} = require("../controllers/authController");
const { protected, authorize } = require("../middleware/authmiddleware");
const leave = require("../models/leave");
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/technician", protected, technician);
router.post("/leave", protected, Leave);
router.get("/admin", protected, authorize("Supervisor", "Team Leader"), admin);
router.patch(
  "/approval",
  protected,
  authorize("Supervisor"),
  approve,
);
module.exports = router;
