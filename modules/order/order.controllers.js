const { OrderCollection, defaultSize, customProductions, productCollection, productCategory } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
// const { Promise } = require("mongoose");
var Promise = require("promise");

const getAllOrder = async (req, res) => {

  try {
    const { type, limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const pipeline = [
      {
        $match: {
          $or: [
            { status: "WaitingReview" },
            { status: "OnHold" },
            { status: "making" },
            { status: "ReadyToShip" },
            { status: "shipped" },
          ],
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "customProductions", // Replace with your collection name
          localField: "cart.1.customMade.productionId",
          foreignField: "_id",
          as: "customProductions",
        },
      }
    ];

    const orders = await OrderCollection.aggregate(pipeline).toArray();


    for (const order of orders) {
      if (order?.status === "WaitingReview" || order?.status === "making") {
        const customMade = order?.cart[1]?.customMade;

        let productions = []
        await Promise.all(
          order?.cart[1]?.customMade.map(async (product) => {
            if (product?.productionId) {
              const production = await customProductions.findOne({ _id: new ObjectId(product?.productionId) });
              productions = [production, ...productions]
              //  }

            }
          })
        )


        const success = productions?.filter((item) => item?.status === 'success')
        const making = productions?.filter((item) => item?.status === 'making' || item?.status === 'reject' || item?.status === 'pending')

        console.log(order?.status)
        if (order?.cart[1]?.customMade?.length === success?.length) {
          await OrderCollection.updateOne(
            { _id: new ObjectId(order._id) },
            { $set: { status: "ReadyToShip" } }
          );
        } else if (order?.cart[1]?.customMade?.length === making?.length) {
          await OrderCollection.updateOne(
            { _id: new ObjectId(order._id) },
            { $set: { status: "making" } }
          );
        } else if (order?.cart[1]?.customMade?.length === 0 && order?.cart[0]?.readyMade?.length > 0) {
          await OrderCollection.updateOne(
            { _id: new ObjectId(order._id) },
            { $set: { status: "ReadyToShip" } }
          );
        } else {
          await OrderCollection.updateOne(
            { _id: new ObjectId(order._id) },
            { $set: { status: "WaitingReview" } }
          );
        }

      }
    }
    res.json({ totalOrders: await OrderCollection.countDocuments(), orders });
  } catch (error) {
    console.log('error', 'order fetch failed');
    res.status(403).send('something went wrong!')
    console.log(error)
    // res.json(error)
  }
};

const getAllDefaultSize = async (req, res) => {
  const cursor = defaultSize.find({});

  const sizes = await cursor.sort({ _id: -1 }).toArray();
  res.send(sizes);
};

const getReadyToShipProduct = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1;
  const search = Number(req.query.search) || null;
  let skip = 0;
  skip = (page - 1) * limit;

  let invoiceId = {}

  if (search !== null) {
    invoiceId = {
      $and: [
        { invoiceID: search }, // Matching orders with status "ReadyToShip"
        { status: { $regex: ".*" + "ReadyToShip" + ".*", $options: "i" } },// Matching orders with status "ReadyToShip"
      ]
    }
  }

  let products = await OrderCollection.aggregate([
    {
      $match: {
        ...invoiceId,
        $or: [
          { status: "ReadyToShip" },
          { status: "shipped" },
        ]
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
            $sort: { _id: -1 } // Sorting orders by _id in descending order
          },
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
    // Define the following variables
    let readyMadeProducts = [];
    let customMadeProducts = [];

    // Check if the products structure is as expected
    if (Array.isArray(products) && products.length > 0 && products[0]?.postsData) {
      products[0].postsData.forEach((product) => {
        if (product?.cart[0]?.readyMade) {
          readyMadeProducts.push(...product.cart[0].readyMade);
        }
        if (product?.cart[1]?.customMade) {
          customMadeProducts.push(...product.cart[1].customMade);
        }
      });
    } else {
      console.log("Handle the case when products or their structure is not as expected");
    }

    // Fetch details for readyMade products and category
    // await Promise.all(

    //   );

    const readyMade = [];
    await Promise.all(readyMadeProducts.map(async (item) => {
      const product = await productCollection.findOne({ _id: new ObjectId(item.productId) });
      const category = await productCategory.findOne({ _id: new ObjectId(product?.category) });
      if (product && category) {
        readyMade.push({ ...product, productSize: item.productSize, category: category.category });
      }
    }));


    // Combine readyMade and customMade products into a single array
    const allProducts = [...readyMade, ...customMadeProducts];

    // Create a response object with orders and products
    const response = { orders: products[0], products: allProducts };

    res.status(200).json(response);
  } else {
    res.status(200).json({
      success: false
    });
  }
};

const updateOrder = async (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body


  if (updateData?.trackingId) {
    OrderCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'shipped' } })
  }


  // Update the document in the collection
  const result = await OrderCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.status(200).send(result); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const createOrder = async (req, res) => {

  try {
    const receivedData = req.body;


    const lastOrder = await OrderCollection.find({}).sort({ _id: -1 }).limit(1).toArray();

    receivedData.invoiceID = lastOrder[0]?.invoiceID + 1

    for (const product of receivedData?.cart[0]?.readyMade) {
      await productCollection.updateOne(
        { _id: new ObjectId(product.productId) },
        { $inc: { [`size.${product.productSize}`]: -1 } }
      );
    }
    const order = await OrderCollection.insertOne(receivedData);
    // return res.send('just testing')
    // Send a response back to the client
    res.status(200).json(order);
  } catch (error) {
    console.log(error)
    // Handle errors and send an error response if needed
    res.status(500).json({ error: 'An error occurred' });
  }

};



const getAOrder = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  OrderCollection.findOne({ _id: new ObjectId(id) })
    .then((document) => {
      if (document) {
        res.json(document); // Send the found document as the response
      }
      // else {
      //   res.sendStatus(404); // Send a 404 status code if the document was not found
      // }
    })
    .catch((error) => {
      console.error("Error finding document:", error);
      res.status(500).send("Error finding document");
    });
};

const deleteAOrderById = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  OrderCollection.deleteOne({ _id: new ObjectId(id) })
    .then((document) => {
      if (document) {
        res.json(document); // Send the found document as the response
      }
      // else {
      //   res.sendStatus(404); // Send a 404 status code if the document was not found
      // }
    })
    .catch((error) => {
      console.error("Error finding document:", error);
      res.status(500).send("Error finding document");
    });
};
const updateDeliveryStatus = (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    // Find the document in the collectio
    // Update a single document
    OrderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );
    res.status(200).send("Updated");
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
};

const updateProductionId = async (req, res) => {
  try {
    const id = req.params.id;
    const productionId = req.body.productionId;
    const index = req.body.index;

    // const dataPath = cart[1].customMade[index].productionId

    const updateProduction = OrderCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [`cart.1.customMade.${index}.productionId`]: productionId } },
      { new: true }
    );
    res.status(200).send(updateProduction);
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
}

const getLastOrder = async (req, res) => {
  try {
    const cursor = OrderCollection.find({}).sort({ _id: -1 }).limit(1);

    const orders = await cursor.toArray();
    res.send(orders);
  } catch (error) {
    console.log(error)
    res.status(204).send(error);
  }
};


const testEndpoint = async (req, res) => {
  // OrderCollection
  const pipeline = [
    {
      $unwind: '$cart'
    },
    {
      $unwind: '$cart.customMade'
    },
    {
      $lookup: {
        from: 'customProductions',
        localField: 'cart.customMade.productionId',
        foreignField: '_id',
        as: 'customProductions'
      }
    },
    {
      $match: {
        'customProductions.status': 'success'
      }
    },
    {
      $group: {
        _id: '$_id'
      }
    }
  ];

  const ordersToUpdate = await OrderCollection.aggregate(pipeline).toArray();

  res.json(ordersToUpdate)

}

module.exports = {
  testEndpoint,
  getAllOrder,
  updateOrder,
  createOrder,
  getAOrder,
  deleteAOrderById,
  updateDeliveryStatus,
  getLastOrder,
  updateProductionId,
  getAllDefaultSize,
  getReadyToShipProduct
};
