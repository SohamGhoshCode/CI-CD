// components/Navbar.jsx
// The sticky top navigation bar shown on every page
import { NavLink } from "react-router-dom";

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar" role="banner">
      <div className="container">
        {/* Logo / Brand */}
        <NavLink to="/" className="navbar-logo" id="navbar-logo">
          <span>🛍️</span>
          ShopEasy
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink
            to="/"
            id="nav-products"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            end
          >
            🏪 Products
          </NavLink>

          {/* Cart link shows a badge with item count */}
          <NavLink
            to="/cart"
            id="nav-cart"
            className={({ isActive }) =>
              `nav-link cart-badge ${isActive ? "active" : ""}`
            }
          >
            🛒 Cart
            {cartCount > 0 && (
              // Badge updates with animation every time count changes
              <span key={cartCount} className="badge">
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
