import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Header = ({
  isOpen,
  onMenuClick,
}: {
  isOpen: boolean;
  onMenuClick: () => void;
}) => {
  const [isMobileHeaderMenu, setIsMobileHeaderMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ reactive resize fix
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  // close mobile menu on route change (optional improvement)
  const closeMenu = () => setIsMobileHeaderMenu(false);

  return (
    <header style={styles.header}>
      {/* Logo */}
      <b style={styles.logo}>🧠 MathKids</b>

      {/* ================= DESKTOP NAV ================= */}
      {!isMobile && (
        <nav style={styles.nav}>
          <NavItem to="/" label="🏠 Home" />
          <NavItem to="/register" label="📝 Register" />
          <NavItem to="/login" label="🔐 Login" />
          <NavItem to="/Kid-Milestone-Tracker" label="🏆 Milestone" />
        </nav>
      )}

      {/* ================= MOBILE SIDEBAR TOGGLE ================= */}
      {isMobile && (
        <button
          onClick={onMenuClick}
          style={styles.menuBtn}
          aria-label="sidebar-toggle"
        >
          {isOpen ? "⬅️" : "➡️"}
        </button>
      )}

      {/* ================= MOBILE HAMBURGER MENU ================= */}
      {isMobile && (
        <button
          onClick={() => setIsMobileHeaderMenu((prev) => !prev)}
          style={styles.menuBtn}
          aria-label="mobile-menu"
        >
          {isMobileHeaderMenu ? "✖" : "☰"}
        </button>
      )}

      {/* ================= MOBILE DROPDOWN ================= */}
      {isMobile && isMobileHeaderMenu && (
        <div style={styles.mobileMenu}>
          <NavItem to="/" label="🏠 Home" onClick={closeMenu} />
          <NavItem to="/register" label="📝 Register" onClick={closeMenu} />
          <NavItem to="/login" label="🔐 Login" onClick={closeMenu} />
          <NavItem
            to="/Kid-Milestone-Tracker"
            label="🏆 Milestone"
            onClick={closeMenu}
          />
        </div>
      )}
    </header>
  );
};

// ---------------- NAV ITEM ----------------
const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        ...styles.link,
        background: isActive ? "#ffcc00" : "transparent",
        color: isActive ? "#000" : "#fff",
        borderRadius: "8px",
      })}
    >
      {label}
    </NavLink>
  );
};

// ---------------- STYLES ----------------
const styles: any = {
  header: {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 15px",
    background: "#4f46e5",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 2000,
  },

  logo: {
    fontSize: 22,
    whiteSpace: "nowrap",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  link: {
    textDecoration: "none",
    padding: "8px 14px",
    fontWeight: "bold",
    transition: "0.3s",
  },

  menuBtn: {
    fontSize: 24,
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginLeft: 8,
  },

  mobileMenu: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    background: "#4f46e5",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    gap: 8,
    zIndex: 3000,
  },
};

export default Header;