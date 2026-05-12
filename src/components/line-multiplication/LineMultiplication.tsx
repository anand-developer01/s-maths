import { useState } from "react";

const GAP_TENS = 60;
const GAP_ONES = 15;

const LineMultiplicationGame = () => {
  const [a, setA] = useState(12);
  const [b, setB] = useState(13);

  const aTens = Math.floor(a / 10);
  const aOnes = a % 10;

  const bTens = Math.floor(b / 10);
  const bOnes = b % 10;

  return (
    <div style={styles.container}>
      <h2>🧮 Spaced Line Multiplication</h2>

      <div style={styles.inputs}>
        <input value={a} onChange={(e) => setA(Number(e.target.value))} />
        <span>×</span>
        <input value={b} onChange={(e) => setB(Number(e.target.value))} />
      </div>

      <svg width="600" height="400" style={styles.board}>
        
        {/* ================= VERTICAL LINES (A) ================= */}
        
        {/* Tens group */}
        {Array.from({ length: aTens }).map((_, i) =>
          Array.from({ length: 10 }).map((_, j) => (
            <line
              key={`vt-${i}-${j}`}
              x1={80 + i * GAP_TENS + j * 2}
              y1={40}
              x2={80 + i * GAP_TENS + j * 2}
              y2={360}
              stroke="#1d4ed8"
              strokeWidth="3"
            />
          ))
        )}

        {/* Ones group */}
        {Array.from({ length: aOnes }).map((_, i) => (
          <line
            key={`vo-${i}`}
            x1={aTens * GAP_TENS + 120 + i * GAP_ONES}
            y1={40}
            x2={aTens * GAP_TENS + 120 + i * GAP_ONES}
            y2={360}
            stroke="#60a5fa"
            strokeWidth="2"
          />
        ))}

        {/* ================= HORIZONTAL LINES (B) ================= */}

        {/* Tens group */}
        {Array.from({ length: bTens }).map((_, i) =>
          Array.from({ length: 10 }).map((_, j) => (
            <line
              key={`ht-${i}-${j}`}
              x1={40}
              y1={80 + i * GAP_TENS + j * 2}
              x2={560}
              y2={80 + i * GAP_TENS + j * 2}
              stroke="#b91c1c"
              strokeWidth="3"
            />
          ))
        )}

        {/* Ones group */}
        {Array.from({ length: bOnes }).map((_, i) => (
          <line
            key={`ho-${i}`}
            x1={40}
            y1={bTens * GAP_TENS + 120 + i * GAP_ONES}
            x2={560}
            y2={bTens * GAP_TENS + 120 + i * GAP_ONES}
            stroke="#f87171"
            strokeWidth="2"
          />
        ))}
      </svg>

      <h3>Answer: {a * b}</h3>

      <p style={styles.note}>
        🔵 Blue = vertical (A) | 🔴 Red = horizontal (B)
      </p>
    </div>
  );
};

const styles: any = {
  container: {
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  inputs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    fontSize: "20px",
    marginBottom: "15px",
  },
  board: {
    border: "2px solid #ddd",
    borderRadius: "12px",
    background: "#fff",
    margin: "auto",
  },
  note: {
    marginTop: "10px",
    color: "#555",
  },
};

export default LineMultiplicationGame;