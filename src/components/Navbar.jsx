import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { currentUser, logout, isAuthenticated } = useAuth();

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="container navbar">
        <NavLink to="/" className="brand">
          Web Alchemist Labs
        </NavLink>

        <nav className="nav-menu">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={getNavLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/cart" className={getNavLinkClass}>
            Cart ({cartCount})
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={getNavLinkClass}>
                Account
              </NavLink>

              <button type="button" className="nav-auth-button" onClick={handleLogout}>
                Logout
              </button>

              <span className="nav-user-email">{currentUser?.email}</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className={getNavLinkClass}>
                Login
              </NavLink>

              <NavLink to="/register" className={getNavLinkClass}>
                Register
              </NavLink>
            </>
          )}

          <NavLink to="/admin" className={getNavLinkClass}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}