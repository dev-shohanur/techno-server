const express = require("express");
const {
  getAllSells,
  createSells,
  getASell,
  updateSell,
} = require("./sells.controllers");
const sellsRoutes = express.Router();

// Define the Sells routes

sellsRoutes.get("/", (req, res) => {
  getAllSells(req, res);
});

sellsRoutes.post("/:id", (req, res) => {
  createSell(req, res);
});
sellsRoutes.get("/:id", (req, res) => {
  getASell(req, res);
});

sellsRoutes.put("/:id", (req, res) => {
  updateSell(req, res);
});

module.exports = sellsRoutes;
