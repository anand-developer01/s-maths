import { Link, useLocation } from "react-router-dom";
import { MENU } from "../../config/menu";

const BottomNav = () => {
  const location = useLocation();

  return (
    <div style={styles.container}>
      {MENU.map((item) => {
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.item,
              background: active ? item.color : "transparent",
              transform: active ? "translateY(-6px) scale(1.1)" : "none",
              boxShadow: active ? "0 8px 0 rgba(0,0,0,0.15)" : "none",
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
          </Link>
        );
      })}
    </div>
  );
};

const styles: any = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,

    height: 65,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    borderTop: "2px solid #e5e7eb",
    zIndex: 9999,
  },

  item: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    margin: 5,
    borderRadius: 15,
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
};

export default BottomNav;