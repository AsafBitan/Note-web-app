const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      require: true,
      unique: true
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    username: {
      type: String,
      require: true,
    },
    passwordHash: {
        type: String,
        require: true,
      },
  });

  const User = mongoose.model("User", userSchema);
  module.exports = User;