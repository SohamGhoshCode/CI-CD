// models/Cart.js - Mongoose schema for a Cart item
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Reference to the Product document
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
