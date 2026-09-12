// routes/cartRoutes.js - All routes related to the shopping cart
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * GET /cart
 * Fetch all cart items, populated with product details
 */
router.get("/", async (req, res) => {
  try {
    // populate("productId") replaces the ObjectId with the actual Product document
    const cartItems = await Cart.find().populate("productId");
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
});

/**
 * POST /cart
 * Add a product to the cart
 * Body: { productId: "<mongoId>", quantity: 1 }
 * If the item already exists in cart, increment its quantity instead
 */
router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate that the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if this product is already in the cart
    const existingItem = await Cart.findOne({ productId });

    if (existingItem) {
      // Increment quantity if already in cart
      existingItem.quantity += quantity;
      await existingItem.save();
      const populated = await existingItem.populate("productId");
      return res.json(populated);
    }

    // Create a new cart item
    const cartItem = new Cart({ productId, quantity });
    await cartItem.save();
    const populated = await cartItem.populate("productId");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
});

/**
 * PATCH /cart/:id
 * Update the quantity of a cart item
 * Body: { quantity: 2 }
 */
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true } // Return the updated document
    ).populate("productId");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ message: "Server error while updating cart item" });
  }
});

/**
 * DELETE /cart/:id
 * Remove a cart item by its cart item _id
 */
router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart", id: req.params.id });
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    res.status(500).json({ message: "Server error while removing cart item" });
  }
});

/**
 * DELETE /cart
 * Clear the entire cart (used after checkout)
 */
router.delete("/", async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ message: "Server error while clearing cart" });
  }
});

module.exports = router;
