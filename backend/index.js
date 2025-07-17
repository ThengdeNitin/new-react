const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {ApolloServer} = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require('path');


require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { json } = require("body-parser");

const app = express();
const PORT = 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // allow both
  credentials: true, // if you use cookies/auth headers
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});
// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/users", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

// Define schema & model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

// Routes
app.get("/", (req, res) => {
  res.send("MongoDB Express API Running");
});

// CREATE
app.post("/api/users", async (req, res) => {
  const user = new User(req.body);
  const result = await user.save();
  res.json(result);
});

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use("/graphql", json(), expressMiddleware(server));
  console.log(`🚀 GraphQL running at http://localhost:${PORT}/graphql`);
}
startApolloServer();

// READ
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
app.put("/api/users/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
app.delete("/api/users/:id", async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.json(deleted);
});


// Register route
const registerRoute = require('./routes/register');
app.use('/register', registerRoute);

// Login route
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// Forgot password route
const forgotPasswordRoute = require('./routes/forgotpassword');
app.use('/forgotpassword', forgotPasswordRoute);

//Add Product Route
const addProductRoute = require('./routes/addproduct');
app.use('/addproduct', addProductRoute);

const productRoute = require('./routes/products');
app.use('/products', productRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
