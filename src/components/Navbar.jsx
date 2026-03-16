import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  }

  function handleCloseMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container navbar">
        <NavLink to="/" className="brand" onClick={handleCloseMenu}>
          Web Alchemist Labs
        </NavLink>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav className={menuOpen ? "nav-menu nav-menu-open" : "nav-menu"}>
          <NavLink to="/" className={getNavLinkClass} onClick={handleCloseMenu}>
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={getNavLinkClass}
            onClick={handleCloseMenu}
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className={getNavLinkClass}
            onClick={handleCloseMenu}
          >
            Cart ({cartCount})
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={getNavLinkClass}
                onClick={handleCloseMenu}
              >
                Account
              </NavLink>

              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={getNavLinkClass}
                  onClick={handleCloseMenu}
                >
                  Admin
                </NavLink>
              ) : null}

              <button
                type="button"
                className="nav-auth-button"
                onClick={handleLogout}
              >
                Logout
              </button>

              <span className="nav-user-email">{currentUser?.email}</span>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={getNavLinkClass}
                onClick={handleCloseMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={getNavLinkClass}
                onClick={handleCloseMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}