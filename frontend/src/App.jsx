// App.jsx - Root component that sets up routing and shared state
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { fetchCart } from "./api/api";

function App() {
  /**
   * cartCount: total number of unique items in the cart (shown in the navbar badge).
   * We keep this in App state so Navbar and ProductList/Cart can both read/update it.
   */
  const [cartCount, setCartCount] = useState(0);

  /**
   * refreshCartCount: fetches the current cart from the backend and updates cartCount.
   * Wrapped in useCallback so it doesn't recreate on every render.
   */
  const refreshCartCount = useCallback(async () => {
    try {
      const response = await fetchCart();
      // Count unique items (each cart document = one product entry)
      setCartCount(response.data.length);
    } catch (error) {
      console.error("Could not refresh cart count:", error);
    }
  }, []);

  // Fetch cart count once when the app first loads
  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <BrowserRouter>
      {/* react-hot-toast container — renders toasts at top-right */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1d27",
            color: "#e8eaf0",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "Inter, sans-serif",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ff6b6b", secondary: "#fff" } },
        }}
      />

      {/* Sticky navbar — receives cartCount for the badge */}
      <Navbar cartCount={cartCount} />

      {/* Main content area */}
      <main className="container">
        <Routes>
          {/* Product List Page */}
          <Route
            path="/"
            element={
              <div className="page">
                <header className="page-header">
                  <h1 className="page-title">
                    Featured <span>Products</span>
                  </h1>
                  <p className="page-subtitle">
                    Discover our hand-picked collection of premium tech gear.
                  </p>
                </header>
                {/* onCartUpdate is called after adding to cart to refresh badge */}
                <ProductList onCartUpdate={refreshCartCount} />
              </div>
            }
          />

          {/* Cart Page */}
          <Route
            path="/cart"
            element={
              <div className="page">
                <header className="page-header">
                  <h1 className="page-title">
                    Your <span>Cart</span>
                  </h1>
                  <p className="page-subtitle">
                    Review your items before placing your order.
                  </p>
                </header>
                <Cart onCartUpdate={refreshCartCount} />
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
