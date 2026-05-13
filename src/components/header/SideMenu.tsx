import { Link, useLocation } from "react-router-dom";
import { MENU } from "../../config/menu";


type Props = {
  open?: boolean;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

const SideMenu = ({ collapsed, setCollapsed }: Props) => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",

        // ✅ responsive width
        width: collapsed ? "80px" : "280px",

        transition: "all 0.3s ease",
        zIndex: 9999,

        background: "linear-gradient(180deg, #ffffff, #f8fafc)",
        boxShadow: "10px 0 30px rgba(0,0,0,0.15)",

        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {!collapsed && (
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            🎒 Kids App
          </div>
        )}

        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            border: "none",
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU ITEMS */}
      <div style={{ padding: "10px", flex: 1 }}>
        {MENU.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 12,

                padding: "12px",
                marginBottom: 10,
                borderRadius: 12,
                textDecoration: "none",

                background: active ? item.color : "#fff",
                color: "#111827",
                fontWeight: 600,

                boxShadow: active
                  ? "0 6px 0 rgba(0,0,0,0.15)"
                  : "0 2px 5px rgba(0,0,0,0.05)",

                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>

              {/* LABEL ONLY WHEN EXPANDED */}
              {!collapsed && (
                <span style={{ fontSize: 14 }}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;