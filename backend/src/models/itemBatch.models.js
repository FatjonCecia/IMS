const mongoose = require("mongoose");

const itemBatchSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },

    expirationDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // Allow update, but prevent creating already expired batch
          if (this.isNew) {
            return value > new Date();
          }
          return true;
        },
        message: "Expiration date must be in the future"
      }
    },

    basePrice: {
      type: Number,
      required: true,
      min: [0, "Base price cannot be negative"]
    },

    offerPrice: {
      type: Number,
      default: null,
      min: [0, "Offer price cannot be negative"]
    },

    manualOverride: {
      type: String,
      enum: {
        values: ["in_offer", null],
        message: "Invalid manual override value"
      },
      default: null
    }
  },
  { timestamps: true }
);

//
// BUSINESS VALIDATION LAYER
//

itemBatchSchema.pre("save", function () {
  if (
    this.offerPrice !== null &&
    this.offerPrice >= this.basePrice
  ) {
    throw new Error("Offer price must be lower than base price");
  }
});

const ItemBatch = mongoose.model("ItemBatch", itemBatchSchema);

module.exports = ItemBatch;