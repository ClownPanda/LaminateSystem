const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    date: String,
    design: String,
    finish: String,
    thickness: String,
    opening: Number,
    production: Number,
    dispatch: Number,
    closing: Number,

    // ✅ user-based data
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);