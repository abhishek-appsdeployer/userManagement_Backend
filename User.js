const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  phone: Number,
  email:String
});

const User = mongoose.model("User", userSchema);

module.exports = User;