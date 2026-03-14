import { NavLink } from "react-router-dom";

export default function Navbar() {
  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

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
            Cart
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Account
          </NavLink>
          <NavLink to="/admin" className={getNavLinkClass}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}