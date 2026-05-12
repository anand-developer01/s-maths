import { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.logo}>🧠 MathKids</div>

      <button
        style={styles.menuBtn}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      <nav style={{ ...styles.nav, display: menuOpen ? "flex" : "flex" }}>
        <NavItem to="/" label="Home" />
        <NavItem to="/learn" label="Learn" />
        <NavItem to="/practice" label="Practice" />
      </nav>
    </header>
  );
};

const NavItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        background: isActive ? "#ffcc00" : "transparent",
        borderRadius: "8px",
      })}
    >
      {label}
    </NavLink>
  );
};

const styles: any = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  nav: {
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
  },
  menuBtn: {
    background: "transparent",
    border: "none",
    fontSize: "22px",
    color: "white",
    display: "none",
  },
};

export default Header;