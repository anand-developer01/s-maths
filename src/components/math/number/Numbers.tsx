import { useState } from "react";

const COLORS = [
  "#FEF9C3", "#DBEAFE", "#F3E8FF", "#DCFCE7",
  "#FFE4E6", "#E0F2FE", "#FDE68A", "#C7D2FE",
  "#BBF7D0", "#FECACA", "#FBCFE8"
];

// 🔊 speak
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
};

const getRange = (range: string) => {
  const [start, end] = range.split("-").map(Number);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const NumberLearning = () => {
  const [range, setRange] = useState("0-10");
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const numbers = getRange(range);

  const handleClick = (num: number) => {
    speak(num.toString());
    setActiveNumber(num);

    setTimeout(() => setActiveNumber(null), 3000);
  };

  const getColor = (num: number) => {
    return COLORS[num % COLORS.length];
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔢 Number Learning Board</h1>

      <p style={styles.subtitle}>
        Click number to hear pronunciation 🎧
      </p>

      {/* RANGE SELECTOR */}
      <div style={styles.selector}>
        {["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              ...styles.rangeBtn,
              background: range === r ? "#111827" : "#e5e7eb",
              color: range === r ? "#fff" : "#111",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {numbers.map((num) => (
          <div
            key={num}
            onClick={() => handleClick(num)}
            style={{
              ...styles.card,
              background: getColor(num),
              color: "#000",
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* FLIP OVERLAY */}
      {activeNumber !== null && (
        <div style={styles.overlay}>
          <div style={styles.flipCard}>
            <div style={styles.flipInner}>

              {/* FRONT */}
              <div
                style={{
                  ...styles.front,
                  background: getColor(activeNumber),
                  color: "#000",
                }}
              >
                {activeNumber}
              </div>

              {/* BACK */}
              <div
                style={{
                  ...styles.back,
                  background: `linear-gradient(135deg, ${getColor(activeNumber)}, #ffffff)`,
                }}
              >
                <div style={styles.bigNumber}>
                  {activeNumber}
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
          100% { transform: rotateY(360deg); }
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
    marginBottom: 10,
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 15,
  },

  selector: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },

  rangeBtn: {
    padding: "8px 14px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
    gap: 12,
    maxWidth: 800,
    margin: "0 auto",
  },

  card: {
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    fontWeight: "bold",
    borderRadius: 18,
    cursor: "pointer",
    boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
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
    animation: "slowFlip 1.8s ease-in-out",
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
    fontSize: 90,
    fontWeight: "900",
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

  bigNumber: {
    fontSize: 120,
    fontWeight: "900",
    color: "#111",
  },
};

export default NumberLearning;