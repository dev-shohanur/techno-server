const express = require("express");
const { loginUserMyApp, getCurentUser, getAllUser } = require("./user.controllers.js");
const userRoutes = express.Router();

// Define the user routes
userRoutes.post("/login", (req, res) => {
  loginUserMyApp(req, res);
});
userRoutes.post("/curent-user", (req, res) => {
  getCurentUser(req, res);
});

userRoutes.get("/", (req, res) => {
  getAllUser(req, res);
});

module.exports = userRoutes;
