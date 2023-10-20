const express = require("express");
const {
  createOfficeOrder,
  getAllOfficeOrder,
  getAOfficeOrder,
  deleteAOfficeOrderById,
  getLastOrder,
  getOrderByTailor,
  updateOrderStatus
} = require("./officeOrder.controllers.js");
const officeOrderRoutes = express.Router();

// Define the user routes
officeOrderRoutes.get("/last", (req, res) => {
  getLastOrder(req, res);
});
officeOrderRoutes.get("/tailor/:id", (req, res) => {
  getOrderByTailor(req, res);
});
officeOrderRoutes.post("/", (req, res) => {
  createOfficeOrder(req, res);
});
officeOrderRoutes.get("/", (req, res) => {
  getAllOfficeOrder(req, res);
});
officeOrderRoutes.get("/:id", (req, res) => {
  getAOfficeOrder(req, res);
});
officeOrderRoutes.delete("/:id", (req, res) => {
  deleteAOfficeOrderById(req, res);
});


officeOrderRoutes.put("/status/:id", (req, res) => {
  updateOrderStatus(req, res);
});


module.exports = officeOrderRoutes;
