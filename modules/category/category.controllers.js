const { ObjectId } = require("mongodb");
const { categorys } = require("../../index.js");
const jwt = require("jsonwebtoken");

// Log in an existing user


const getAllCategory = async (req, res) => {
  const category = await categorys.find({}).toArray();

  res.status(200).json(category);
}
const getACategory = async (req, res) => {
  try {

    const id = req.params.id


    const category = await categorys.findOne({ _id: new ObjectId(id) });

    res.status(200).json(category);
  } catch (error) {
    console.error(error)
  }
}

module.exports = { getAllCategory, getACategory };
