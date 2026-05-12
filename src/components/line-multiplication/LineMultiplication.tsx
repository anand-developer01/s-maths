import { useState, useMemo } from "react";

interface Point {
  x: number;
  y: number;
}

const LineMultiplicationGame = () => {
  const [a, setA] = useState(12);
  const [b, setB] = useState(13);

  const aTens = Math.floor(a / 10);
  const aOnes = a % 10;

  const bTens = Math.floor(b / 10);
  const bOnes = b % 10;

  // FIXED BOARD SIZE (RESPONSIVE FRIENDLY)
  const width = 600;
  const height = 400;

  // 🔥 INTERSECTION DETECTION
  const getIntersection = (p1: Point, p2: Point, p3: Point, p4: Point) => {
    const denom =
      (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

    if (denom === 0) return null;

    const t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) /
      denom;

    const u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) /
      denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y),
      };
    }

    return null;
  };

  // 🔥 BUILD ALL LINES (NORMALIZED SAME SIZE)
  const verticalLines = useMemo(() => {
    const lines: any[] = [];

    // A vertical full lines (same size)
    for (let i = 0; i < aTens * 10 + aOnes; i++) {
      const x = 80 + i * 8;

      lines.push({
        x1: x,
        y1: 40,
        x2: x,
        y2: height - 40,
        type: "V",
      });
    }

    return lines;
  }, [a]);

  const horizontalLines = useMemo(() => {
    const lines: any[] = [];

    for (let i = 0; i < bTens * 10 + bOnes; i++) {
      const y = 60 + i * 8;

      lines.push({
        x1: 40,
        y1: y,
        x2: width - 40,
        y2: y,
        type: "H",
      });
    }

    return lines;
  }, [b]);

  // 🔥 COMPUTE CROSSING POINTS
  const intersections = useMemo(() => {
    const points: Point[] = [];

    verticalLines.forEach(v => {
      horizontalLines.forEach(h => {
        const p = getIntersection(
          { x: v.x1, y: v.y1 },
          { x: v.x2, y: v.y2 },
          { x: h.x1, y: h.y1 },
          { x: h.x2, y: h.y2 }
        );

        if (p) points.push(p);
      });
    });

    return points;
  }, [verticalLines, horizontalLines]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧮 Spaced Line Multiplication</h2>

      {/* INPUTS */}
      <div style={styles.inputs}>
        <input value={a} onChange={(e) => setA(Number(e.target.value))} />
        <span style={{ fontSize: 22 }}>×</span>
        <input value={b} onChange={(e) => setB(Number(e.target.value))} />
      </div>

      {/* BOARD */}
      <div style={styles.card}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={styles.svg}
        >
          {/* VERTICAL LINES */}
          {verticalLines.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#3b82f6"
              strokeWidth="2"
            />
          ))}

          {/* HORIZONTAL LINES */}
          {horizontalLines.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="#ef4444"
              strokeWidth="2"
            />
          ))}

          {/* 🔥 CROSSING POINTS */}
          {intersections.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#111827"
            />
          ))}
        </svg>
      </div>

      {/* RESULT */}
      <h3 style={styles.result}>Answer: {a * b}</h3>

      <p style={styles.note}>
        🔵 Blue = Vertical | 🔴 Red = Horizontal | ⚫ Black dots = Cross points
      </p>
    </div>
  );
};

const styles: any = {
  container: {
    textAlign: "center",
    fontFamily: "Arial",
    padding: 10,
    background: "#f8fafc",
  },

  title: {
    color: "#0f172a",
    fontSize: 24,
  },

  inputs: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 15,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    maxWidth: "100%",
    overflowX: "auto",
  },

  svg: {
    width: "100%",
    height: "auto",
  },

  result: {
    marginTop: 15,
    fontSize: 26,
    color: "#16a34a",
    fontWeight: "bold",
  },

  note: {
    marginTop: 10,
    color: "#6b7280",
  },
};

export default LineMultiplicationGame;