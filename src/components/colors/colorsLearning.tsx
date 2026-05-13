import { useState } from "react";

const BASIC_COLORS = [
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Orange", value: "#F97316" },
];

const MORE_COLORS = [
  { name: "Sky Blue", value: "#0EA5E9" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Lime", value: "#84CC16" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Fuchsia", value: "#D946EF" },
];

// 🔊 speak
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
};

const ColorsLearning = () => {
  const [activeColor, setActiveColor] = useState<null | { name: string; value: string }>(null);
  const [showMore, setShowMore] = useState(false);

  const colors = showMore
    ? [...BASIC_COLORS, ...MORE_COLORS]
    : BASIC_COLORS;

  const handleClick = (color: { name: string; value: string }) => {
    speak(color.name);
    setActiveColor(color);

    setTimeout(() => setActiveColor(null), 2500);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎨 Colors Learning Board</h1>
      <p style={styles.subtitle}>Click a color to hear its name 🎧</p>

      {/* MORE BUTTON */}
      <button
        onClick={() => setShowMore((p) => !p)}
        style={styles.moreBtn}
      >
        {showMore ? "Show Less Colors 🔼" : "Show More Colors ➕"}
      </button>

      {/* GRID */}
      <div style={styles.grid}>
        {colors.map((color, i) => (
          <div
            key={i}
            onClick={() => handleClick(color)}
            style={{
              ...styles.card,
              background: color.value,
            }}
          >
            {color.name}
          </div>
        ))}
      </div>

      {/* FLIP CARD OVERLAY */}
      {activeColor && (
        <div style={styles.overlay}>
          <div style={styles.flipCard}>
            <div style={styles.flipInner}>

              {/* FRONT */}
              <div
                style={{
                  ...styles.front,
                  background: activeColor.value,
                }}
              >
                {activeColor.name}
              </div>

              {/* BACK */}
              <div
                style={{
                  ...styles.back,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    ...styles.bigText,
                    color: activeColor.value,
                  }}
                >
                  {activeColor.name}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>{`
        @keyframes slowFlip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: 20,
    textAlign: "center",
    fontFamily: '"Comic Sans MS", cursive',
    background: "linear-gradient(135deg, #f0f9ff, #fefce8)",
  },

  title: {
    fontSize: "2.5rem",
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 15,
  },

  moreBtn: {
    padding: "10px 18px",
    borderRadius: 20,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 15,
    maxWidth: 900,
    margin: "0 auto",
  },

  card: {
    height: 100,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    transition: "all 0.2s ease",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flipCard: {
    width: 220,
    height: 220,
    perspective: 1000,
  },

  flipInner: {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    animation: "slowFlip 1.2s ease-in-out",
  },

  front: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },

  back: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  bigText: {
    fontSize: 32,
    fontWeight: "900",
  },
};

export default ColorsLearning;