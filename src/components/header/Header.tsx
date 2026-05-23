import { NavLink } from "react-router-dom";

const Header = ({
  isOpen,
  onMenuClick,
}: {
  isOpen: boolean;
  onMenuClick: () => void;
}) => {
  return (
    <header
      style={{
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
      }}
    >
      {/* Logo */}
      <b style={{ fontSize: 22 }}>🧠 MathKids</b>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <NavItem to="/" label="🏠 Home" />

        <NavItem
          to="/register"
          label="📝 Register"
        />

        <NavItem
          to="/login"
          label="🔐 Login"
        />

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          style={{
            fontSize: 24,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </nav>
    </header>
  );
};

const NavItem = ({
  to,
  label,
}: {
  to: string;
  label: string;
}) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        background: isActive
          ? "#ffcc00"
          : "transparent",
        color: isActive ? "#000" : "#fff",
        borderRadius: "8px",
      })}
    >
      {label}
    </NavLink>
  );
};

const styles: any = {
  link: {
    textDecoration: "none",
    padding: "8px 14px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default Header;