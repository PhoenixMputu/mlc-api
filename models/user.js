const mongoose = require("mongoose");
const database = require("../services/mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    pseudo: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = database.model("User", userSchema);

module.exports = User;