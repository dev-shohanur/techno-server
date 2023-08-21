const { ObjectId } = require("mongodb");
const { productions, productionCategory } = require("../../index.js");




const getCategory = async (req, res) => {

  // console.log("shohan")

  const category = await productionCategory.find({}).toArray();

  res.status(200).json(category);
}
const createCategory = async (req, res) => {

  const category = req.body;

  console.log(category)

  await productionCategory.insertOne(category)

  res.status(200).json({success: true});
}

module.exports = {
  getCategory,
  createCategory
};
