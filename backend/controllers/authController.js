const Users = require("../models/user");
const Technicians = require("../models/technician");
const Leave = require("../models/leave");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { name, employeeId, email, password, role, shop } = req.body;
  try {
    const employee = await Users.findOne({ employeeId });
    if (employee) {
      return res.status(400).json({ message: "Employee already exsits" });
    }
    const newEmloyee = await Users.create({
      name,
      employeeId,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      shop,
    });
    const token = jwt.sign(
      { userId: newEmloyee._id, role: newEmployee.role },
      process.env.secret_key,
      {
        expiresIn: "7d",
      },
    );
    res.status(200).json({
      message: "Employee created",
      employee: newEmloyee,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  const { employeeId, email, password } = req.body;
  try {
    if (!employeeId || !email || !password) {
      return res.status(400).json({ message: "mandatory fields " });
    }
    const employee = await Users.findOne({ employeeId });
    // console.log(employee._id);
    if (!employee) {
      return res.status(400).json({ message: "User not found " });
    } else {
      if (await bcrypt.compare(password, employee.password)) {
        const token = jwt.sign(
          { userId: employee._id, role: employee.role },
          process.env.secret_key,
          {
            expiresIn: "7d",
          },
        );
        return res.status(200).json({ employee: employee, token: token });
      }
      return res.status(400).json({ message: "password is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.technician = async (req, res) => {
  const { zone, section, area, designation } = req.body;
  if (!zone || !section || !area || !designation) {
    return res.status(400).json({ message: "Provide all details" });
  }
  try {
    const technicianDetails = await Technicians.create({
      userId: req.user.userId,
      zone,
      section,
      area,
      designation,
    });
    res.status(200).json({ details: technicianDetails });
  } catch (error) {
    console.log(error.code);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Invalid Section" });
    }
  }
};

exports.Leave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const createLeave = await Leave.create({
      userId: req.user.userId,
      startDate: start,
      endDate: end,
      reason,
    });
    res.json(createLeave);
  } catch (error) {
    console.log(error);
  }
};

exports.admin = async (req, res) => {
  try {
    const users = await Technicians.find().populate("userId");
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE1OTJjMzIxMzYwMDkzNDY3YWExYTkiLCJyb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTc3MjYyNjc0NiwiZXhwIjoxNzczMjMxNTQ2fQ.Xq_UzKPzm33xw1hKyH514DVsg0mwYMApQ4GM6MEB7cs
