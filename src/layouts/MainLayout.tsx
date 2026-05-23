import { Outlet } from "react-router-dom";
import SideMenu from "../components/header/SideMenu";
import Header from "../components/header/Header";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div>
      {/* PASS STATE TO HEADER */}
      <Header
        isOpen={mobileOpen}
        onMenuClick={() => setMobileOpen((p) => !p)}
      />

      <SideMenu
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 280,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
export default MainLayout;