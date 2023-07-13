const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
const User = require("./User");

// connnection
mongoose
  .connect("mongodb://localhost:27017/UserManagement", {
    dbName: "UserManagement",

    useNewUrlParser: true,

    useUnifiedTopology: true,
    family: 4,
  })
  .then((_) => console.log("Connection to MongoDB eshtablished!"))
  .catch((err) => console.log(err));

app.use(cors());

app.use(express.json());

app.post("/user", async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email, phone });
    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete the users
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    console.log("Try to delte");
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Update a user by ID
app.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, email, phone } = req.body;
  
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { username, email, phone },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
