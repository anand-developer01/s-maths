import React, { useState } from "react";
import DrawingHeader from './DrawingHeader'

// ─── Types ────────────────────────────────────────────────────────────────────
type Direction = "→" | "←" | "↑" | "↓";
type Cell = { arrow: Direction } | null;

// ─── Grid constants ───────────────────────────────────────────────────────────
const COLS = 5;
const ROWS = 5;

const toRC = (idx: number) => ({ row: Math.floor(idx / COLS), col: idx % COLS });
const toIdx = (row: number, col: number) => row * COLS + col;

/**
 * Returns every cell index that the arrow at `from` passes through
 * (excluding `from` itself) until it would leave the grid.
 */
// const getPath = (from: number, arrow: Direction, cells: Cell[]): number[] => {
const getPath = (from: number, arrow: Direction): number[] => {
  const path: number[] = [];
  let { row, col } = toRC(from);
  while (true) {
    if (arrow === "→") col++;
    else if (arrow === "←") col--;
    else if (arrow === "↓") row++;
    else if (arrow === "↑") row--;
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) break;
    path.push(toIdx(row, col));
  }
  return path;
};

/**
 * An arrow can exit only when EVERY cell along its path is empty.
 */
const canExit = (from: number, arrow: Direction, cells: Cell[]): boolean =>
  getPath(from, arrow).every((i) => cells[i] === null);

/**
 * Returns the first occupied (blocking) cell index along the path,
 * or null if the path is clear.
 */
const getBlocker = (from: number, arrow: Direction, cells: Cell[]): number | null =>
  getPath(from, arrow).find((i) => cells[i] !== null) ?? null;

// ─── Levels ───────────────────────────────────────────────────────────────────
// null = empty cell. Every arrow is solvable in at least one order.
const LEVELS: (Direction | null)[][] = [
  // Level 1 — Easy
  [
    null, "→",  null, "←",  null,
    "↓",  null, null, null, "↑",
    null, null, null, null, null,
    "↓",  null, null, null, "↑",
    null, "→",  null, "←",  null,
  ],
  // Level 2 — Medium
  [
    "→",  null, "↓",  null, "←",
    null, "↓",  null, "↑",  null,
    "↓",  null, null, null, "↑",
    null, "↑",  null, "↓",  null,
    "→",  null, "↑",  null, "←",
  ],
  // Level 3 — Hard
  [
    "→",  "↓",  "←",  "↓",  "←",
    "↓",  null, "↑",  null, "↓",
    "→",  "→",  null, "←",  "←",
    "↑",  null, "↓",  null, "↑",
    "→",  "↑",  "→",  "↑",  "←",
  ],
];

const LEVEL_LABELS = ["Easy", "Medium", "Hard"];

const buildCells = (layout: (Direction | null)[]): Cell[] =>
  layout.map((a) => (a ? { arrow: a } : null));

// ─── Component ────────────────────────────────────────────────────────────────
const ArrowMazeGame: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [cells, setCells] = useState<Cell[]>(buildCells(LEVELS[0]));
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  // Visual feedback states
  const [clearedIdx, setClearedIdx] = useState<number | null>(null);   // green flash
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);       // red shake
  const [blockerIdx, setBlockerIdx] = useState<number | null>(null);   // orange flash
  const [hintIdx, setHintIdx] = useState<number | null>(null);         // yellow hint
  const [msg, setMsg] = useState("");

  // ── Click an arrow cell ──────────────────────────────────────────────────
  const handleClick = (idx: number) => {
    if (won) return;
    const cell = cells[idx];
    if (!cell) return; // empty cell — ignore

    if (canExit(idx, cell.arrow, cells)) {
      // ✅ Path is clear — the arrow slides out and disappears
      setClearedIdx(idx);
      setMsg("✅ Nice!");

      setTimeout(() => {
        setClearedIdx(null);
        const updated = cells.map((c, i) => (i === idx ? null : c));
        setCells(updated);
        setScore((s) => s + 10);
        setMsg("");

        if (updated.every((c) => c === null)) {
          setWon(true);
          setMsg("🎉 Level Complete!");
        }
      }, 350);
    } else {
      // ❌ Blocked — flash this arrow red and highlight the blocker orange
      const blocker = getBlocker(idx, cell.arrow, cells);
      setWrongIdx(idx);
      setBlockerIdx(blocker);
      setMsg("❌ Blocked! Clear the way first.");

      setTimeout(() => {
        setWrongIdx(null);
        setBlockerIdx(null);
        setMsg("");
      }, 700);
    }
  };

  // ── Hint: highlight a random arrow that can currently exit ───────────────
  const handleHint = () => {
    const valid = cells
      .map((c, i) => ({ c, i }))
      .filter(({ c, i }) => c && canExit(i, c.arrow, cells));
    if (!valid.length) { setMsg("No moves available!"); setTimeout(() => setMsg(""), 900); return; }
    const pick = valid[Math.floor(Math.random() * valid.length)];
    setHintIdx(pick.i);
    setTimeout(() => setHintIdx(null), 1200);
  };

  // ── Reset / Next level ───────────────────────────────────────────────────
  const resetLevel = () => {
    setCells(buildCells(LEVELS[levelIndex]));
    setWon(false);
    setMsg("");
    setClearedIdx(null);
    setWrongIdx(null);
    setBlockerIdx(null);
    setHintIdx(null);
  };

  const goNextLevel = () => {
    const next = (levelIndex + 1) % LEVELS.length;
    setLevelIndex(next);
    setCells(buildCells(LEVELS[next]));
    setWon(false);
    setMsg("");
    setClearedIdx(null);
    setWrongIdx(null);
    setBlockerIdx(null);
    setHintIdx(null);
  };

  // ── Cell visual ──────────────────────────────────────────────────────────
  const cellStyle = (idx: number, cell: Cell): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 68,
      height: 68,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      boxShadow: "0 3px 8px rgba(0,0,0,0.10)",
      userSelect: "none",
      transition: "background 0.18s, transform 0.18s, box-shadow 0.18s",
      cursor: cell ? "pointer" : "default",
    };
    if (!cell)          return { ...base, background: "#F1F5F9", opacity: 0.45, boxShadow: "inset 0 1px 4px rgba(0,0,0,0.06)" };
    if (idx === wrongIdx)   return { ...base, background: "#FCA5A5", transform: "scale(0.90)" };
    if (idx === clearedIdx) return { ...base, background: "#86EFAC", transform: "scale(1.12)" };
    if (idx === blockerIdx) return { ...base, background: "#FED7AA", transform: "scale(1.06)" };
    if (idx === hintIdx)    return { ...base, background: "#FDE68A", transform: "scale(1.10)" };
    return { ...base, background: "#DBEAFE" };
  };

  const arrowCount = cells.filter(Boolean).length;

  return (
    <div style={s.container}>
      <DrawingHeader/>
      <h2 style={s.title}>🧭 Arrow Maze</h2>

      {/* Stats */}
      <div style={s.topBar}>
        <span style={s.badge}>⭐ {score}</span>
        <span style={s.badge}>Level {levelIndex + 1} — {LEVEL_LABELS[levelIndex]}</span>
        <span style={s.badge}>{arrowCount} left</span>
      </div>

      {/* Rule */}
      <p style={s.rule}>
        Tap an arrow — it slides out if its <strong>full path is clear</strong>.<br />
        Any arrow blocking the path = wrong move!
      </p>

      {/* Message */}
      <div style={{ ...s.msgBox, opacity: msg ? 1 : 0 }}>{msg || "​"}</div>

      {/* Grid */}
      <div style={s.grid}>
        {cells.map((cell, idx) => (
          <div key={idx} onClick={() => handleClick(idx)} style={cellStyle(idx, cell)}>
            {cell && <span style={s.arrowText}>{cell.arrow}</span>}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={s.btnRow}>
        <button onClick={handleHint} style={s.btnYellow} disabled={won}>💡 Hint</button>
        <button onClick={resetLevel} style={s.btnRed}>🔄 Retry</button>
        {won && <button onClick={goNextLevel} style={s.btnGreen}>▶ Next Level</button>}
      </div>

      {/* Legend */}
      <div style={s.legend}>
        <Dot c="#86EFAC" /> Can exit &nbsp;
        <Dot c="#FCA5A5" /> Blocked &nbsp;
        <Dot c="#FED7AA" /> Blocker &nbsp;
        <Dot c="#FDE68A" /> Hint
      </div>
    </div>
  );
};

const Dot = ({ c }: { c: string }) => (
  <span style={{ display:"inline-block", width:11, height:11, borderRadius:3, background:c, marginRight:3 }} />
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    padding: "24px 16px 40px",
    background: "linear-gradient(145deg,#EFF6FF 0%,#FEF9C3 100%)",
    fontFamily: '"Comic Sans MS", cursive',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: { fontSize: "2rem", marginBottom: 12, color: "#1E40AF", letterSpacing: 1 },
  topBar: { display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", justifyContent: "center" },
  badge: {
    background: "#fff",
    border: "1.5px solid #BFDBFE",
    borderRadius: 20,
    padding: "5px 14px",
    fontWeight: "bold",
    fontSize: "0.88rem",
    color: "#1E40AF",
  },
  rule: {
    fontSize: "0.88rem",
    color: "#475569",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 320,
    marginBottom: 6,
  },
  msgBox: {
    fontSize: "1.05rem",
    fontWeight: "bold",
    color: "#DC2626",
    height: 26,
    textAlign: "center",
    marginBottom: 8,
    transition: "opacity 0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(${COLS}, 68px)`,
    gap: 8,
    marginBottom: 16,
  },
  arrowText: { fontSize: "2.1rem", lineHeight: 1 },
  btnRow: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 },
  btnYellow: { padding: "10px 20px", border: "none", borderRadius: 12, background: "#FACC15", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  btnRed:    { padding: "10px 20px", border: "none", borderRadius: 12, background: "#EF4444", color: "#fff", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  btnGreen:  { padding: "10px 20px", border: "none", borderRadius: 12, background: "#22C55E", color: "#fff", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  legend: { fontSize: "0.82rem", color: "#64748B", display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 2 },
};

export default ArrowMazeGame;