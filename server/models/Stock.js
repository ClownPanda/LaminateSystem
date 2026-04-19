
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  date: String,
  design: String,
  finish: String,
  thickness: String,
  opening: Number,
  production: Number,
  dispatch: Number,
  closing: Number,
  userId: String
});

module.exports = mongoose.model("Stock", stockSchema);
