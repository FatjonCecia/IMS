const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["restaurant", "bakery", "grocery"],
      required: true
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;