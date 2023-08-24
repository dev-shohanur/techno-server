const express = require("express");
const { loginUserMyApp, getCurentUser, getAllUser, getUserById, getAllTailor } = require("./user.controllers.js");
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
userRoutes.get("/tailor", (req, res) => {
  getAllTailor(req, res);
});
userRoutes.get("/:id", (req, res) => {
  getUserById(req, res);
});

module.exports = userRoutes;
