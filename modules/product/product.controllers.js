
const { ObjectId } = require("mongodb");
const { products } = require("../../index.js");
const jwt = require("jsonwebtoken");

// Log in an existing user


const getAllProduct = async (req, res) => {
  const result = await products.find({}).toArray();

  res.status(200).json(result);
}
const getProductsForUser = async (req, res) => {
  const result = await products.find({ show: true }).toArray();

  res.status(200).json(result);
}
const getAProducts = async (req, res) => {

  try {
    const id = req.params.id;

    if (id) {
      const result = await products.findOne({ _id: new ObjectId(id) });

      return res.status(200).json(result);
    }
    return res.status(401).json("error");
  } catch (error) {
    console.error(error)
  }
}
const addNewProduct = async (req, res) => {

  const product = req.body;

  const result = await products.insertOne(product);

  res.status(200).json(result);
}
const updateProduct = async (req, res) => {

  const id = req.params.id;
  const product = req.body;

  const result = await products.updateOne({ _id: new ObjectId(id), }, { $set: product });

  res.status(200).json(result);
}
const updateProductShow = async (req, res) => {

  const id = req.params.id;
  const { show } = req.query;

  const result = await products.updateOne({ _id: new ObjectId(id), }, { $set: { show: show === "true" ? true : false } });

  res.status(200).json(result);
}
const deleteProduct = async (req, res) => {

  const id = req.params.id;

  const result = await products.deleteOne({ _id: new ObjectId(id), });

  res.status(200).json(result);
}

module.exports = { getAllProduct, addNewProduct, updateProduct, deleteProduct, updateProductShow, getProductsForUser, getAProducts };
