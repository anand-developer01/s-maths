import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/line-multiplication">line-multiplication</Link>
        <Link to="/line-math-practice">line-math-practice</Link>
        <Link to="/asmd-game">asmd-game</Link>
        <Link to="/practice">Practice</Link>
      </nav>

      <Outlet />
    </div>
  );
};

export default MainLayout;