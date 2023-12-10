const express = require("express");
const { getAllCategory, getACategory } = require("./category.controllers.js");
const categoryRoutes = express.Router();

// Define the user routes

categoryRoutes.get("/", (req, res) => {
  getAllCategory(req, res);
});
categoryRoutes.get("/:id", (req, res) => {
  getACategory(req, res);
});

module.exports = categoryRoutes;
