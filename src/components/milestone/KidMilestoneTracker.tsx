import { useEffect, useMemo, useState } from "react";

const TOTAL_LEVELS = 100;
const CURRENT_LEVEL = 27;

type Pos = {
  x: number;
  y: number;
  level: number;
};

const KidMilestoneChainBoard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", onResize);
    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  const COLS = isMobile ? 4 : 5;
  const SIZE = 80;
  const GAP = 20;

  // ---------------- LEVELS ----------------
  const levels = useMemo(
    () =>
      Array.from(
        { length: TOTAL_LEVELS },
        (_, i) => i + 1
      ),
    []
  );

  // ---------------- SNAKE POSITIONS ----------------
  const positions: Pos[] = useMemo(() => {
    const pos: Pos[] = [];

    let x = 0;
    let y = 0;
    let direction = 1;

    levels.forEach((level) => {
      pos.push({
        level,
        x: x * (SIZE + GAP),
        y: y * (SIZE + GAP),
      });

      x += direction;

      if (x >= COLS) {
        x = COLS - 1;
        y += 1;
        direction = -1;
      } else if (x < 0) {
        x = 0;
        y += 1;
        direction = 1;
      }
    });

    return pos;
  }, [levels, COLS]);

  // Mobile reverse view (100 → 1)
  const displayPositions = isMobile
    ? [...positions].reverse()
    : positions;

  // ---------------- SVG PATH (CHAIN LINE) ----------------
  const pathD = useMemo(() => {
    return displayPositions
      .map((p, i) => {
        const cx = p.x + SIZE / 2;
        const cy = p.y + SIZE / 2;

        return i === 0
          ? `M ${cx} ${cy}`
          : `L ${cx} ${cy}`;
      })
      .join(" ");
  }, [displayPositions]);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        🏆 Learning Chain Journey (1 → 100)
      </div>

      <div style={styles.sub}>
        Complete levels step by step
      </div>

      {/* BOARD */}
      <div style={styles.boardWrapper}>
        <div
          style={{
            position: "relative",
            width:
              COLS * (SIZE + GAP),
            height:
              Math.ceil(
                TOTAL_LEVELS / COLS
              ) *
                (SIZE + GAP) +
              100,
            margin: "0 auto",
          }}
        >
          {/* SVG CHAIN LINE */}
          <svg
            style={styles.svg}
            width="100%"
            height="100%"
          >
            <path
              d={pathD}
              stroke="#94A3B8"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.5}
            />
          </svg>

          {/* LEVEL NODES */}
          {displayPositions.map((p) => {
            const completed =
              p.level < CURRENT_LEVEL;

            const current =
              p.level === CURRENT_LEVEL;

            return (
              <div
                key={p.level}
                style={{
                  ...styles.node,
                  left: p.x,
                  top: p.y,
                  background: current
                    ? "linear-gradient(135deg,#4ADE80,#22C55E)"
                    : completed
                    ? "linear-gradient(135deg,#FACC15,#F59E0B)"
                    : "#CBD5E1",
                  transform: current
                    ? "scale(1.2)"
                    : "scale(1)",
                }}
              >
                <div style={styles.icon}>
                  {current
                    ? "🚀"
                    : completed
                    ? "⭐"
                    : "🔒"}
                </div>
                <div style={styles.text}>
                  {p.level}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles: any = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background:
      "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    fontFamily: '"Comic Sans MS", cursive',
  },

  header: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 900,
    color: "#1E3A8A",
  },

  sub: {
    textAlign: "center",
    marginBottom: 30,
    color: "#64748B",
  },

  boardWrapper: {
    overflowX: "auto",
  },

  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },

  node: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    zIndex: 2,
    transition: "0.3s ease",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },

  icon: {
    fontSize: 18,
  },

  text: {
    fontSize: 14,
  },
};

export default KidMilestoneChainBoard;