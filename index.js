const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users");
const app = express();
const port = 3000;

require("dotenv").config();
const mongoUrl = process.env.MONGO_URL;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Post a new user
app.post("/users", async (req, res) => {
  const data = req.body;

  const newUser = new User({
    name: data.name,
    email: data.email,
    age: data.age,
    isActive: data.isActive,
  });

  //save to database
  const savedUser = await newUser.save();

  res.json(savedUser);
});

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get active users
app.get("/users/active", async (req, res) => {
  const activeUsers = await User.find({ isActive: true });
  res.json(activeUsers);
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const update = req.body;

  const result = await User.updateOne(
    { _id: userId },
    { $set: update },
    { runValidators: true }
  );

  res.json(result);
});

// Deactivate a user
app.put("users/:id/deactivate", async (req, res) => {
  const userId = req.params.id;

  const deactivated = await User.updateOne(
    { _id: userId },
    { $set: { isActive: false } },
    { runValidators: true }
  );
  res.json(deactivated);
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  const deleted = await User.deleteOne({ _id: userId });

  res.json(deleted);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
