const { ObjectId } = require("mongodb");
const { productCollection } = require("../../index.js");





const createProduct = async (req, res) => {
  const product = req.body.product;


  await productCollection.insertOne(product);
  // Send a response back to the client
  res.json({ message: "Data received successfully" });
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
    {
      $match: {
        $or: [
          { productName: { $regex: ".*" + search + ".*" } },
          { price: { $regex: ".*" + search + ".*" } },
          { productCode: { $regex: ".*" + search + ".*" } },
          { size: { $regex: ".*" + search + ".*" } },
          { category: { $regex: ".*" + search + ".*" } }
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


module.exports = {
  createProduct,
  getProducts
};
