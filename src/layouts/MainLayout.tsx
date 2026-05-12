import { Link, Outlet, useLocation } from "react-router-dom";

// reuse your theme style
const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "🏠", color: "#FEF9C3", shadow: "#CA8A04" },
  { to: "/line-multiplication", label: "Multiply", icon: "✖️", color: "#F3E8FF", shadow: "#9333EA" },
  { to: "/line-math-practice", label: "Practice", icon: "🧠", color: "#DBEAFE", shadow: "#2563EB" },
  { to: "/asmd-game", label: "ASMD Game", icon: "🎮", color: "#DCFCE7", shadow: "#16A34A" },
  { to: "/alphabet", label: "Alphabet", icon: "🔤", color: "#FDE68A", shadow: "#CA8A04" },
];

const MainLayout = () => {
  const location = useLocation();

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.card,
                background: item.color,
                boxShadow: active
                  ? `0 8px 0 ${item.shadow}`
                  : "0 4px 0 rgba(0,0,0,0.1)",
                transform: active ? "scale(1.08)" : "scale(1)",
                border: active ? `3px solid ${item.shadow}` : "3px solid transparent",
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.text}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PAGE CONTENT */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

const styles: any = {
  page: {
    fontFamily: '"Comic Sans MS", cursive',
    background: "linear-gradient(135deg, #f0f9ff, #fefce8)",
    minHeight: "100vh",
  },

  nav: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    padding: "20px",
  },

  card: {
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    fontWeight: "bold",
    color: "#111827",
    cursor: "pointer",
    userSelect: "none",
  },

  icon: {
    fontSize: "1.3rem",
  },

  text: {
    fontSize: "1rem",
  },

  content: {
    padding: "10px",
  },
};

export default MainLayout;