import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MENU } from "../../config/menu";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;

  // NEW (mobile control)
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
};

const HEADER_HEIGHT = 60;

const SideMenu = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: Props) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // detect screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const closeMobile = () => setMobileOpen?.(false);

  // ================= MOBILE / TABLET =================
  if (isMobile) {
    return (
      <>
        {/* BACKDROP */}
        {mobileOpen && (
          <div
            onClick={closeMobile}
            style={{
              position: "fixed",
              top: HEADER_HEIGHT,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 999,
            }}
          />
        )}

        {/* DRAWER (BELOW HEADER) */}
        <div
          style={{
            position: "fixed",
            top: HEADER_HEIGHT,
            left: 0,
            transform: mobileOpen ? "translateX(0)" : "translateX(-280px)",
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            width: 280,
            background: "linear-gradient(180deg,#fff,#f8fafc)",
            transition: "transform 0.3s ease",
            zIndex: 1000,
            boxShadow: "10px 0 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            willChange: "transform",
          }}
        >
          {/* MENU */}
          <div style={{ padding: 10 }}>
            {MENU.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    marginBottom: 10,
                    borderRadius: 12,
                    textDecoration: "none",
                    background: active ? item.color : "#fff",
                    color: "#111827",
                    fontWeight: 600,
                    boxShadow: active
                      ? "0 6px 0 rgba(0,0,0,0.15)"
                      : "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // ================= DESKTOP =================
  return (
    <div
      style={{
        position: "fixed",
        top: HEADER_HEIGHT,
        left: 0,
        height: "100vh",
        width: collapsed ? 80 : 280,
        transition: "all 0.3s ease",
        background: "linear-gradient(180deg,#fff,#f8fafc)",
        boxShadow: "10px 0 30px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: 15,
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {!collapsed && <b>🎒 Kids App</b>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            border: "none",
            background: "#111827",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU */}
      <div style={{ padding: 10, flex: 1 }}>
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
                padding: 12,
                marginBottom: 10,
                borderRadius: 12,
                textDecoration: "none",
                background: active ? item.color : "#fff",
                color: "#111827",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;