import { useState } from "react";

type Cell = {
  id: number;
  arrow: string;
};

const LEVELS: Cell[][] = [
  // LEVEL 1 (easy path)
  [
    { id: 0, arrow: "→" },
    { id: 1, arrow: "→" },
    { id: 2, arrow: "↓" },
    { id: 3, arrow: "→" },
    { id: 4, arrow: "↓" },
    { id: 5, arrow: "←" },
    { id: 6, arrow: "↑" },
    { id: 7, arrow: "→" },
    { id: 8, arrow: "↓" },
  ],

  // LEVEL 2 (medium)
  [
    { id: 0, arrow: "↓" },
    { id: 1, arrow: "→" },
    { id: 2, arrow: "→" },
    { id: 3, arrow: "↓" },
    { id: 4, arrow: "←" },
    { id: 5, arrow: "↓" },
    { id: 6, arrow: "→" },
    { id: 7, arrow: "→" },
    { id: 8, arrow: "↓" },
  ],

  // LEVEL 3 (hard)
  [
    { id: 0, arrow: "→" },
    { id: 1, arrow: "↓" },
    { id: 2, arrow: "←" },
    { id: 3, arrow: "↓" },
    { id: 4, arrow: "→" },
    { id: 5, arrow: "→" },
    { id: 6, arrow: "↓" },
    { id: 7, arrow: "←" },
    { id: 8, arrow: "↓" },
  ],
];

// correct path for each level
const PATHS = [
  [0, 1, 2, 5, 8],
  [1, 2, 5, 8],
  [0, 3, 4, 7, 8],
];

const ArrowMazeGame = () => {
  const [level, setLevel] = useState(0);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const grid = LEVELS[level];
  const path = PATHS[level];

  const handleClick = (id: number) => {
    const expected = path[step];

    if (id === expected) {
      setMessage("✅ Correct Move!");
      setScore((s) => s + 1);
      setStep((s) => s + 1);

      // level complete
      if (step + 1 === path.length) {
        setTimeout(() => {
          setMessage("🎉 Level Completed!");

          setTimeout(() => {
            nextLevel();
          }, 800);
        }, 300);
      }
    } else {
      setMessage("❌ Wrong Move! Restarting...");
      setStep(0);
    }

    setTimeout(() => setMessage(""), 800);
  };

  const nextLevel = () => {
    if (level < LEVELS.length - 1) {
      setLevel((l) => l + 1);
      setStep(0);
      setMessage("");
      setShowHint(false);
    } else {
      setMessage("🏆 All Levels Completed!");
    }
  };

  const resetGame = () => {
    setLevel(0);
    setStep(0);
    setScore(0);
    setMessage("");
    setShowHint(false);
  };

  const getHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 1200);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧭 Arrow Maze Game</h2>

      <div style={styles.topBar}>
        <div>⭐ Score: {score}</div>
        <div>🎯 Level: {level + 1}</div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {/* GRID */}
      <div style={styles.grid}>
        {grid.map((cell, index) => {
          const isHint = showHint && path[step] === index;

          return (
            <div
              key={cell.id}
              onClick={() => handleClick(index)}
              style={{
                ...styles.cell,
                background: isHint ? "#FDE68A" : "#E0F2FE",
                transform: isHint ? "scale(1.1)" : "scale(1)",
              }}
            >
              {cell.arrow}
            </div>
          );
        })}
      </div>

      {/* BUTTONS */}
      <div style={styles.buttons}>
        <button onClick={getHint} style={styles.btnHint}>
          💡 Hint
        </button>

        <button onClick={resetGame} style={styles.btnReset}>
          🔄 Restart
        </button>
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: 20,
    background: "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    fontFamily: '"Comic Sans MS", cursive',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: "2rem",
    marginBottom: 10,
  },

  topBar: {
    display: "flex",
    gap: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },

  message: {
    fontSize: "1.2rem",
    marginBottom: 10,
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 90px)",
    gap: 12,
    marginTop: 10,
  },

  cell: {
    width: 90,
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    borderRadius: 12,
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    userSelect: "none",
  },

  buttons: {
    marginTop: 20,
    display: "flex",
    gap: 10,
  },

  btnHint: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    background: "#FACC15",
    fontWeight: "bold",
    cursor: "pointer",
  },

  btnReset: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    background: "#EF4444",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ArrowMazeGame;