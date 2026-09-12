// server.js - Main entry point for the Express backend
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// Health-check endpoint
app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running 🚀" });
});

// ─── Connect to MongoDB, then start server ─────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Seed sample products if the collection is empty
    const Product = require("./models/Product");
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          name: "Wireless Headphones",
          price: 1299,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          description: "Premium over-ear wireless headphones with 40-hour battery life and active noise cancellation.",
        },
        {
          name: "Mechanical Keyboard",
          price: 2499,
          image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
          description: "TKL mechanical keyboard with RGB backlight and tactile brown switches.",
        },
        {
          name: "Smart Watch",
          price: 3999,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
          description: "Feature-rich smartwatch with health tracking, GPS, and 7-day battery.",
        },
        {
          name: "USB-C Hub",
          price: 899,
          image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400",
          description: "7-in-1 USB-C hub with HDMI, USB-A, SD card reader, and 100W PD.",
        },
        {
          name: "Webcam HD 1080p",
          price: 1599,
          image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400",
          description: "Full HD webcam with autofocus, built-in mic, and wide-angle lens.",
        },
        {
          name: "Portable Speaker",
          price: 1999,
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
          description: "Waterproof Bluetooth speaker with 360° sound and 20-hour battery.",
        },
      ]);
      console.log("🌱 Sample products seeded");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
