const Users = require('../models/user')
const bcrypt = require('bcrypt')
exports.register = async (req, res) => {
  const { name, employeeId, email, password, role, shop } = req.body;
  try {
      const employee = await Users.findOne({ employeeId });
      if (employee) {
          return res.status(400).json({message:"Employee already exsits"})
      }
      const newEmloyee = await Users.create({
        name,employeeId,email,password:(await bcrypt.hash(password,10)),role,shop
      })
      res.status(200).json({message:"Employee created",employee:newEmloyee})
  } catch (error) {
      console.log(error);
  }
};
