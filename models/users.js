const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  age: { type: Number },
  isActive: { type: Boolean },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
