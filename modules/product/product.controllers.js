const { ObjectId } = require("mongodb");
const { productCollection } = require("../../index.js");





const createProduct = async (req, res) => {
  const product = req.body.product;


  await productCollection.insertOne(product);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};


module.exports = {
  createProduct
};
