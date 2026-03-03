const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
mongoose.connect("mongodb://127.0.0.1:27017/leavemanage")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth/", require('./routes/authRoute'));
const server = app.listen(3000, () => {
  console.log("server started at port 3000");
});

const gracefulShutdown = () => {
  console.log("server closed");
  server.close(() => {
    console.log("clean server closed");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
