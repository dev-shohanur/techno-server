const { customerCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

// Log in an existing user
const getAllCustomerBySearch = async (req, res) => {
  const search = req.params.key;
  try {
    let customer = await customerCollection
      .find({
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { number: { $regex: ".*" + search + ".*" } },
          { address: { $regex: ".*" + search + ".*" } },
        ],
      })
      .toArray();

    // if (customer.length === 0) {
    //   res.status(200).json("no customer");
    // } else {
    res.status(200).json({ customer });
    // }
    // res.status(200).json("customer Already created");
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const createCustomer = async (req, res) => {


  try {
    const { name, number, address } = req.body;


    console.log(name, number, address)

    // Find the user in the database
    // return res.json({ user: req.body})
    const customer = await customerCollection.findOne({ number });

    if (!customer) {
      const createdCustomer = await customerCollection.insertOne({
        name,
        number,
        address,
      });

      return res.status(200).json(createdCustomer);
    }
    return res.status(200).json(customer);

    // if (createNewCustomer) {
    //   res.status(200).json(createNewCustomer);
    // } else {
    //   res.status(200).json(customer);
    // }

    // createNewCustomer !== ""
    //   ? res.status(200).json( createNewCustomer )
    //   : res.status(200).json(customer);
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(204).json({ error: "An error occurred" });
  }
};

const getAllCustomer = async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 5
  const search = req.query.search || '';
  const skip = (page - 1) * limit

  console.log(search)

  try {
    let customer = await customerCollection.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: ".*" + search + ".*", $options: "i" } },
            { number: { $regex: ".*" + search + ".*", $options: "i" } },
            { address: { $regex: ".*" + search + ".*", $options: "i" } },
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
              $sort: { _id: -1 } // Sorting in ascending order of serialNumber
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
    ]).sort({ _id: -1 }).toArray();

    res.status(200).json( customer );
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const updateCustomer = (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters
  const updateData = req.body; // Extract the updated data from the request body


  // Update the document in the collection
  customerCollection
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(() => {
      res.sendStatus(200); // Send a success status code if the update was successful
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Error updating document");
    });
};

const getCustomerById = async (req, res) => {
  const id = req.params.id; // Extract the document ID from the request parameters

  // Find the document in the collection
  customerCollection
    .findOne({ _id: new ObjectId(id) })
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

const getCustomerByNumber = async (req, res) => {
  const number = req.params.number; // Extract the document ID from the request parameters

  // Find the document in the collection
  try {
    customerCollection
      .findOne({ number })
      .then((document) => {
        if (document) {
          return res.json(document); // Send the found document as the response
        }
        res.json(); // Send the found document as the response
        // else {
        //   res.sendStatus(404); // Send a 404 status code if the document was not found
        // }
      })
  } catch (error) {
    console.error("Error finding document:", error);
    res.status(500).send("Error finding document");
  }
};

module.exports = {
  createCustomer,
  getAllCustomer,
  getCustomerById,
  updateCustomer,
  getAllCustomerBySearch,
  getCustomerByNumber,
};
