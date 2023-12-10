const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyTokenMiddleware = require("./verifyTokenMiddleware");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
const corsConfig = {
  origin: "",
  headers: "Content-Type",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

const uri = "mongodb+srv://shohanur:SiNRSxd1HZHIyhJ8@cluster0.yichpba.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const categorys = client.db("techno-iwasa").collection("categorys");
    const users = client.db("techno-iwasa").collection("users");
    const products = client.db("techno-iwasa").collection("products");

    // Middleware for parsing JSON data
    app.use(express.json());

    //Export Collection
    module.exports = {
      categorys,
      users,
      products
    };

    // Routes
    const userRoutes = require("./modules/users/user.routes");
    app.use("/user", userRoutes);
    const categoryRoutes = require("./modules/category/category.routes");
    app.use("/category", categoryRoutes);
    const productRoutes = require("./modules/product/product.routes");
    app.use("/product", productRoutes);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
