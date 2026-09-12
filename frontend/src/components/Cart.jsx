// components/Cart.jsx
// Displays all cart items and an Order Summary sidebar with checkout flow
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, updateCartItem, clearCart } from "../api/api";
import toast from "react-hot-toast";

const Cart = ({ onCartUpdate }) => {
  // State for cart items (each item has _id, productId object, quantity)
  const [cartItems, setCartItems] = useState([]);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Show/hide the checkout success modal
  const [showModal, setShowModal] = useState(false);

  // Track which item quantity is being updated
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  /**
   * Fetch all cart items when the component mounts.
   * GET /cart returns items populated with product details.
   */
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetchCart();
        setCartItems(response.data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast.error("Could not load cart.");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  /**
   * Remove a single item from the cart.
   * Sends DELETE /cart/:id and updates local state optimistically.
   */
  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      // Remove from local state without refetching
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      toast.success("Item removed");
      onCartUpdate(); // Refresh navbar badge
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Could not remove item.");
    }
  };

  /**
   * Update quantity of a cart item.
   * Sends PATCH /cart/:id with the new quantity.
   */
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return; // Prevent going below 1
    setUpdatingId(cartItemId);
    try {
      const response = await updateCartItem(cartItemId, newQty);
      // Replace the updated item in local state
      setCartItems((prev) =>
        prev.map((item) => (item._id === cartItemId ? response.data : item))
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Could not update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * Simulate checkout:
   * 1. Clear the cart via DELETE /cart
   * 2. Show success modal
   */
  const handleCheckout = async () => {
    try {
      await clearCart();
      setCartItems([]);
      onCartUpdate(); // Reset navbar badge to 0
      setShowModal(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Try again.");
    }
  };

  // ─── Computed values ───────────────────────────────────────────────────────
  // Total number of items (sum of all quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Total price (price × quantity for each item)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 99) : 0; // Free shipping above ₹2000
  const total = subtotal + shipping;

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-icon" style={{ animation: "shimmer 1s infinite" }}>
          🛒
        </div>
        <p>Loading your cart…</p>
      </div>
    );
  }

  // ─── Empty cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0 && !showModal) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button
          id="btn-browse-products"
          className="btn btn-primary"
          onClick={() => navigate("/")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ─── Cart Layout ──────────────────────────────────────────────────── */}
      {cartItems.length > 0 && (
        <div className="cart-layout">
          {/* Left: list of cart items */}
          <div className="cart-items" role="list" aria-label="Cart items">
            {cartItems.map((item) => (
              <div
                key={item._id}
                id={`cart-item-${item._id}`}
                className="cart-item"
                role="listitem"
              >
                {/* Product thumbnail */}
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="cart-item-img"
                />

                {/* Product info & quantity control */}
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.productId.name}</h3>
                  <p className="cart-item-price">
                    {item.productId.price.toLocaleString("en-IN")}
                  </p>

                  {/* Quantity stepper — calls PATCH on change */}
                  <div className="qty-control" role="group" aria-label="Quantity">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || updatingId === item._id}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-display" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      disabled={updatingId === item._id}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right: subtotal + remove */}
                <div className="cart-item-actions">
                  <p className="cart-item-subtotal">
                    Subtotal:{" "}
                    <strong>
                      ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </p>
                  <button
                    id={`remove-${item._id}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item._id)}
                    aria-label={`Remove ${item.productId.name} from cart`}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <aside className="order-summary" aria-label="Order summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "🎉 Free" : `₹${shipping}`}</span>
            </div>

            {shipping === 0 && subtotal > 0 && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-success)",
                  marginBottom: 8,
                }}
              >
                ✅ You qualify for free shipping!
              </p>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>{total.toLocaleString("en-IN")}</span>
            </div>

            {/* Checkout button triggers dummy checkout */}
            <button
              id="btn-checkout"
              className="btn btn-success btn-lg"
              style={{ width: "100%", marginTop: 20 }}
              onClick={handleCheckout}
            >
              ✅ Place Order
            </button>

            <button
              id="btn-continue-shopping"
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </button>
          </aside>
        </div>
      )}

      {/* ─── Checkout Success Modal ────────────────────────────────────────── */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            // Close modal when clicking the backdrop
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal">
            <div className="modal-icon">🎉</div>
            <h2 id="modal-title">Order Placed!</h2>
            <p>
              Thank you for your purchase! Your order has been placed
              successfully. (This is a demo — no real payment was charged.)
            </p>
            <button
              id="btn-back-to-products"
              className="btn btn-primary btn-lg"
              onClick={() => {
                setShowModal(false);
                navigate("/");
              }}
            >
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
