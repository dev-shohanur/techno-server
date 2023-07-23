const { ObjectId } = require("mongodb");
const { productCollection, productCategory } = require("../../index.js");





const createProduct = async (req, res) => {
  const product = req.body.product;


  await productCollection.insertOne(product);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
};

const getCategory = async (req, res) => {

 const category = await productCategory.find({}).toArray();
  // Send a response back to the client
  res.status(200).json(category);
};
const getProductById = async (req, res) => {

  const id = req.params.id;

  const product = await productCollection.find({_id: new ObjectId(id)}).toArray();
  // Send a response back to the client
  res.status(200).json(product[0]);
};
const updateProductById = async (req, res) => {

  const id = req.params.id;
  const updateData = req.body

   await productCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  // Send a response back to the client
  res.status(200).json("Data Updated");
};

const getProducts = async (req, res) => {

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 1
  const search = req.query.search || ''
  let category = req.query.category || '';


  const skip = (page - 1) * limit

  let categoryFilter = {};
  if (category) {
    categoryFilter = { category }
  }

  let products = await productCollection.aggregate([
    { $sort: { _id: -1 } },
    {
      $match: {
        $or: [
          { productName: { $regex: ".*" + search + ".*", $options: "i" } },
          { price: { $regex: ".*" + search + ".*", $options: "i" } },
          { productCode: { $regex: ".*" + search + ".*", $options: "i" } },
          { size: { $regex: ".*" + search + ".*", $options: "i" } },
          { category: { $regex: ".*" + search + ".*", $options: "i" } }
        ],
        ...categoryFilter
      }
    },
    {
      $facet: {
        totalCount: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              count: 1
            }
          }
        ],
        postsData: [
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ]
      }
    },
    {
      $project: {
        totalCount: { $arrayElemAt: ["$totalCount", 0] },
        postsData: 1
      }
    }
  ]).toArray();

  if (products.length) {
    res.status(200).json(products[0] );

  } else {
    res.status(200).json({
      success: false
    });

  }
}

const updateProductStock = (req, res) => {
  const id = req.params.id;
  const stock = req.body.stock;

  // Find the document in the collection
  // Update a single document
  productCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { stock: stock } }
  );
  res.status(200).send("Updated");
};

module.exports = {
  createProduct,
  getProducts,
  getCategory,
  getProductById,
  updateProductById,
  updateProductStock
};
