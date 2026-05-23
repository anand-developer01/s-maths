import { NavLink } from "react-router-dom";

const THEMES = [
  { bg: "#FEF9C3", accent: "#FACC15", text: "#A16207", shadow: "#CA8A04" },
  { bg: "#DBEAFE", accent: "#60A5FA", text: "#1E40AF", shadow: "#2563EB" },
  { bg: "#F3E8FF", accent: "#C084FC", text: "#6B21A8", shadow: "#9333EA" },
  { bg: "#DCFCE7", accent: "#4ADE80", text: "#166534", shadow: "#16A34A" },
];

const DEFAULT_NAV_ITEMS = [
  { key: "/alphabet", label: "Alphabet", icon: "🏠", theme: THEMES[0] },
  { key: "/A-Z-Bubble-Game", label: "A-Z Bubble", icon: "🔤", theme: THEMES[1] },
  { key: "/Alphabet-Phonics-Quiz", label: "Alphabet-Phonics-Quiz", icon: "🔢", theme: THEMES[2] },
  { key: "/Phonics-Typing-Quiz", label: "Phonics-Typing-Quiz", icon: "➕", theme: THEMES[3] },
  // { key: "/drawing", label: "Draw", icon: "🎨", theme: THEMES[0] },
  // { key: "/stories", label: "Stories", icon: "📖", theme: THEMES[1] },
  // { key: "/puzzles", label: "Puzzles", icon: "🧩", theme: THEMES[2] },
];

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: 5,
        borderRadius: 18,
        background: "#fff",
        flexWrap: "wrap",
      }}
    >
      {DEFAULT_NAV_ITEMS.map((item) => (
        <NavItem
          key={item.key}
          to={item.key}
          label={item.label}
          icon={item.icon}
          theme={item.theme}
        />
      ))}
    </div>
  );
};

type NavItemProps = {
  to: string;
  label: string;
  icon: string;
  theme: {
    bg: string;
    accent: string;
    text: string;
    shadow: string;
  };
};

const NavItem = ({
  to,
  label,
  icon,
  theme,
}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: "none",
        padding: "10px 14px",
        fontWeight: "bold",
        borderRadius: "12px",
        transition: "0.3s",

        background: isActive
          ? theme.accent
          : theme.bg,

        color: theme.text,

        boxShadow: isActive
          ? `0 4px 0 ${theme.shadow}`
          : "none",
      })}
    >
      {icon} {label}
    </NavLink>
  );
};

export default Header;