import { Outlet } from "react-router-dom";
import SideMenu from "../components/header/SideMenu";
import BottomNav from "../components/header/BottomNav";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ NEW: sidebar state
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 1024);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 📌 dynamic width
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 280;

  return (
    <div>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <SideMenu
          open={true}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingBottom: isMobile ? "80px" : 0,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default MainLayout;