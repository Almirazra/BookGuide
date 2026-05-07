import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/rekomendasi", label: "Rekomendasi" },
  { to: "/kategori", label: "Kategori" },
  { to: "/kontak", label: "Kontak" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top bookguide-navbar">
      <div className="container-fluid bookguide-navbar-inner">
        <NavLink className="navbar-brand fw-bold bookguide-brand" to="/">
          <span className="bookguide-brand-mark">B</span>
          <span>BOOKGUIDE</span>
        </NavLink>

        {/* Menu desktop - tetap seperti semula */}
        <div className="bookguide-menu d-none d-lg-block">
          <ul className="navbar-nav d-flex flex-row align-items-center">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link fw-semibold ${isActive ? "active" : ""}`
                  }
                  to={item.to}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink className="nav-link fw-semibold bookguide-admin-link" to="/admin">
                Admin
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Hamburger button */}
        <div className="hamburger-menu d-lg-none" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </div>
      </div>

      {/* Mobile menu - muncul kalau isOpen true */}
      {isOpen && (
        <div className="bookguide-mobile-menu d-lg-none">
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link fw-semibold ${isActive ? "active" : ""}`
                  }
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink
                className="nav-link fw-semibold bookguide-admin-link"
                to="/admin"
                onClick={closeMenu}
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;