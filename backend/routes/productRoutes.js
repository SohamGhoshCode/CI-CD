// routes/productRoutes.js - All routes related to products
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/**
 * GET /products
 * Fetch all products from the database
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Get all products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error while fetching products" });
  }
});

/**
 * GET /products/:id
 * Fetch a single product by its ID
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Server error while fetching product" });
  }
});

module.exports = router;
