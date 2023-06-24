const { customerCollection } = require("../../index.js");
const jwt = require("jsonwebtoken");

// Log in an existing user
const createCustomer = async (req, res) => {
  try {
    const { name, number, address } = req.body;

    console.log(name, number, address);
    // Find the user in the database
    const customer = await customerCollection.findOne({ number });

    console.log(customer);

    let createNewCustomer = "";

    if (!createNewCustomer === "") {
      const newCustomer = await customerCollection.insertOne({
        name,
        number,
        address,
      });

      createNewCustomer = newCustomer;
    }
    console.log(createNewCustomer);

    // if (createNewCustomer) {
    // return res.status(200).json({ createNewCustomer });
    // }
    !createCustomer === ""
      ? res.status(200).json({ createNewCustomer })
      : res.status(200).json(customer);
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getCustomerByNumber = async (req, res) => {
  try {
    const { number } = req.body;

    console.log(number);
    // Find the user in the database
    const customer = await customerCollection.findOne({ number });

    console.log(customer);

    // if (createNewCustomer) {
    // return res.status(200).json({ createNewCustomer });
    // }
    customer === ""
      ? res.status(200).json({ customer })
      : res.status(200).json("It's New Customer");
    // res.status(200).json("customer Already created");
  } catch (err) {
    console.error("Error Create User:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = { createCustomer, getCustomerByNumber };
