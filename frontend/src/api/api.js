// api/api.js - Centralised API configuration using axios
// All backend requests go through this file — easy to change the base URL in one place
import axios from "axios";

// The base URL of our Express backend
// Empty string = use relative URLs (works with both Vite proxy in dev AND Nginx proxy in Docker)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// ─── Product API calls ──────────────────────────────────────────────────────────
export const fetchProducts = () => API.get("/products");

// ─── Cart API calls ─────────────────────────────────────────────────────────────
export const fetchCart = () => API.get("/cart");

export const addToCart = (productId, quantity = 1) =>
  API.post("/cart", { productId, quantity });

export const updateCartItem = (cartItemId, quantity) =>
  API.patch(`/cart/${cartItemId}`, { quantity });

export const removeFromCart = (cartItemId) =>
  API.delete(`/cart/${cartItemId}`);

export const clearCart = () => API.delete("/cart");
