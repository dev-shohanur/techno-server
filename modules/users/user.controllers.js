const { ObjectId } = require("mongodb");
const { users } = require("../../index.js");
const jwt = require("jsonwebtoken");

// Log in an existing user


const getAllUser = async (req, res) => {
  const user = await users.find({}).toArray();

  res.status(200).json(user);
}
const getAllTailor = async (req, res) => {
  const user = await users.find({ role: "tailor" }).toArray();

  res.status(200).json(user);
}
const getUserById = async (req, res) => {

  const id = req.params.id
  console.error(id)
  if (id) {

    const user = await users.findOne({ _id: new ObjectId(id) });

    return res.status(200).json(user);
  } else {
    return res.status(401).json("error");
  }

}



const loginUserMyApp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password is correct
    const passwordMatch = (await password) === user.password;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(user, process.env.JWT_TOKEN);

    res.status(200).json({ token, user });
  } catch (err) {
    console.error("Error logging in user ssoososo:", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getCurentUser = async (req, res) => {
  // Get the JWT token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, "1231");

    // Attach the user's information to the request object
    req.user = decoded;

    res.json(req.user);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { loginUserMyApp, getCurentUser, getAllUser, getUserById, getAllTailor };
