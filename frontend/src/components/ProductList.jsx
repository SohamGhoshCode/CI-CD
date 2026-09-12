// components/ProductList.jsx
// Displays all products fetched from the backend in a responsive grid
import { useState, useEffect } from "react";
import { fetchProducts, addToCart } from "../api/api";
import toast from "react-hot-toast";

const ProductList = ({ onCartUpdate }) => {
  // State for holding the list of products
  const [products, setProducts] = useState([]);

  // State for showing skeleton loaders while fetching
  const [loading, setLoading] = useState(true);

  // Track which products are being added to cart (to disable their button)
  const [addingId, setAddingId] = useState(null);

  /**
   * useEffect runs once when the component mounts.
   * It fetches all products from GET /products.
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data); // response.data is the array of products
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Could not load products. Is the backend running?");
      } finally {
        setLoading(false); // Always stop loading, even on error
      }
    };

    loadProducts();
  }, []); // Empty dependency array = run once on mount

  /**
   * handleAddToCart sends a POST /cart request with the product's id.
   * After success it calls onCartUpdate() to refresh the cart count in the navbar.
   */
  const handleAddToCart = async (productId) => {
    setAddingId(productId); // Disable the button for this product
    try {
      await addToCart(productId);
      toast.success("Added to cart! 🛒");
      onCartUpdate(); // Notify parent to refresh cart count
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Could not add to cart.");
    } finally {
      setAddingId(null); // Re-enable the button
    }
  };

  // ─── Skeleton loader cards while fetching ─────────────────────────────────
  if (loading) {
    return (
      <div className="product-grid" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton skeleton-img" />
            <div className="skeleton-body">
              <div className="skeleton" style={{ height: 20, width: "70%" }} />
              <div className="skeleton" style={{ height: 14, width: "100%" }} />
              <div className="skeleton" style={{ height: 14, width: "80%" }} />
              <div
                className="skeleton"
                style={{ height: 36, width: "100%", marginTop: 8 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Empty state if no products ────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h3>No Products Found</h3>
        <p>The backend returned no products. Make sure the seed data loaded.</p>
      </div>
    );
  }

  // ─── Product Grid ──────────────────────────────────────────────────────────
  return (
    <section className="product-grid" aria-label="Product listing">
      {products.map((product) => (
        <article key={product._id} className="product-card" id={`product-${product._id}`}>
          {/* Product image with hover zoom effect */}
          <div className="product-img-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
              loading="lazy"
            />
          </div>

          {/* Product details */}
          <div className="product-body">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>

            <div className="product-footer">
              {/* Price displayed with ₹ via CSS ::before */}
              <span className="product-price">{product.price.toLocaleString("en-IN")}</span>

              {/* Add to cart button — disabled while request is in flight */}
              <button
                id={`add-to-cart-${product._id}`}
                className="btn btn-primary btn-sm"
                onClick={() => handleAddToCart(product._id)}
                disabled={addingId === product._id}
                aria-label={`Add ${product.name} to cart`}
              >
                {addingId === product._id ? "Adding…" : "+ Add to Cart"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ProductList;
