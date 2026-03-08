const Users = require("../models/user");
const Technicians = require("../models/technician");
const Leave = require("../models/leave");
const { createEvent } = require("../utils/calender");
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
    const leave = await Leave.find({
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
    if (leave.length < 3) {
      const createLeave = await Leave.create({
        userId: req.user.userId,
        startDate,
        endDate,
        reason,
        status: "Pending",
      });
      return res.json(createLeave);
    }
    res.json("sorry");
    // console.log(leave);
  } catch (error) {
    console.log(error);
  }
};

exports.admin = async (req, res) => {
  try {
    const users = await Technicians.find().populate("userId");
    const leave = await Leave.find();
    // res.json({ users, leave });
  } catch (error) {
    console.log(error);
  }
};

exports.approve = async (req, res) => {
  const { userId, status } = req.body;
  try {
    const leaveCount = await Leave.findOne({ userId: userId });
    const leave = await Leave.findOneAndUpdate(
      { userId: userId },
      {
        status: status,
        totalLeave:
          leaveCount.totalLeave -
          (leaveCount.endDate - leaveCount.startDate) / (1000 * 60 * 60 * 24),
      },
      { new: true },
    ).populate("userId");
    await createEvent(
      leave.startDate,
      leave.endDate,
      leave.userId.name,
      leave.userId.employeeId,
    );
    res.json(leave);
  } catch (error) {
    console.log(error);
  }
};
