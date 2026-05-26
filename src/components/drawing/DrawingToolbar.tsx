import React from "react";

export type ShapeType =
  | "freehand"
  | "eraser"
  | "circle"
  | "oval"
  | "square"
  | "rectangle"
  | "star"
  | "rhombus"
  | "parallelogram"
  | "spray"
  | "fill"
  | "gradient-fill";

type Props = {
  color: string;
  setColor: (c: string) => void;

  size: number;
  setSize: (n: number) => void;

  shape: ShapeType;
  setShape: (s: ShapeType) => void;

  undo: () => void;
  redo: () => void;
  clear: () => void;
  download: () => void;

  isFullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
};

const SHAPES: { type: ShapeType; label: string; icon: string }[] = [
  { type: "freehand", label: "Pen", icon: "✏️" },
  { type: "eraser", label: "Eraser", icon: "🩹" },

  { type: "spray", label: "Spray", icon: "🫧" },
  { type: "fill", label: "Fill", icon: "🪣" },
  { type: "gradient-fill", label: "Gradient", icon: "🌈" },

  { type: "circle", label: "Circle", icon: "⭕" },
  { type: "oval", label: "Oval", icon: "🥚" },

  { type: "square", label: "Square", icon: "⬛" },
  { type: "rectangle", label: "Rectangle", icon: "▭" },

  { type: "star", label: "Star", icon: "⭐" },
  { type: "rhombus", label: "Rhombus", icon: "🔷" },
  { type: "parallelogram", label: "Parallel", icon: "▱" },
];

const DrawingToolbar: React.FC<Props> = ({
  color,
  setColor,
  size,
  setSize,
  shape,
  setShape,
  undo,
  redo,
  clear,
  download,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Shapes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {SHAPES.map((s) => (
          <button
            key={s.type}
            onClick={() => setShape(s.type)}
            style={{
              padding: 8,
              borderRadius: 10,
              border: shape === s.type ? "2px solid #3B82F6" : "1px solid #ccc",
              background: shape === s.type ? "#DBEAFE" : "#fff",
              cursor: "pointer",
              minWidth: 70,
            }}
          >
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 10 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Size */}
      <div style={{ marginTop: 10 }}>
        <input
          type="range"
          min={2}
          max={30}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </div>

      {/* Actions */}
      <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={undo}>↩ Undo</button>
        <button onClick={redo}>↪ Redo</button>
        <button onClick={clear}>🗑 Clear</button>
        <button onClick={download}>💾 Save</button>

        {!isFullscreen ? (
          <button onClick={enterFullscreen}>⛶ Full</button>
        ) : (
          <button onClick={exitFullscreen}>✕ Exit</button>
        )}
      </div>

      {/* Color */}
      <div style={{ marginTop: 10 }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DrawingToolbar;