import React, { useRef, useState, useEffect, useCallback } from "react";

type Point = { x: number; y: number };

type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

const COLORS = [
  "rgb(239, 68, 68)",
  "rgb(244, 63, 94)",
  "rgb(248, 113, 113)",

  "rgb(59, 130, 246)",
  "rgb(99, 102, 241)",
  "rgb(6, 182, 212)",

  "rgb(34, 197, 94)",
  "rgb(20, 184, 166)",
  "rgb(132, 204, 22)",

  "rgb(234, 179, 8)",
  "rgb(251, 191, 36)",
  "rgb(249, 115, 22)",

  "rgb(168, 85, 247)",
  "rgb(147, 51, 234)",
  "rgb(236, 72, 153)",

  "rgb(17, 24, 39)",
  "rgb(107, 114, 128)",
  "rgb(229, 231, 235)",

  "rgb(255, 255, 255)",
  "rgb(250, 250, 250)",

  "rgb(120, 53, 15)",
  "rgb(180, 83, 9)",
  "rgb(217, 119, 6)",

  "rgb(14, 165, 233)",
  "rgb(124, 58, 237)",
  "rgb(244, 114, 182)",
];

const KidDrawingApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState(COLORS[3]);
  const [size, setSize] = useState(6);

  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  // const [isShaking, setIsShaking] = useState(false); // kept for shake-animation class compatibility

  // ---- FULLSCREEN STATE ----
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ---- MOBILE PENCIL CURSOR ----
  // Detect touch device once on mount - doesn't change during session
  const isMobile = useRef(
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
  const [pencilPos, setPencilPos] = useState<{ x: number; y: number } | null>(null);

  // ---------------- DRAW ALL ----------------
  const drawAll = useCallback(
    (strokeList?: Stroke[]) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const logicalW = canvas.width / dpr;
      const logicalH = canvas.height / dpr;

      ctx.clearRect(0, 0, logicalW, logicalH);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, logicalW, logicalH);

      const list = strokeList ?? strokes;
      list.forEach((stroke) => {
        drawStroke(ctx, stroke);
      });
    },
    [strokes]
  );

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }

    ctx.stroke();
  };

  // ---------------- RESIZE CANVAS TO WRAP ----------------
  const resizeCanvas = useCallback((w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas || w === 0 || h === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    drawAll();
  }, [drawAll]);

  // ResizeObserver fires as soon as the wrap has real dimensions —
  // no race condition, works on first paint and on every resize / fullscreen change.
  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        resizeCanvas(Math.floor(width), Math.floor(height));
      }
    });

    ro.observe(wrap);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    drawAll();
  }, [strokes]);

  // ---------------- POINTER FIX ----------------
  const getPoint = (e: any): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const isTouch = "touches" in e;

    const clientX = isTouch
      ? e.touches[0].clientX
      : e.clientX;

    const clientY = isTouch
      ? e.touches[0].clientY
      : e.clientY;

    // 📱 mobile finger offset
    const PENCIL_OFFSET_X = -6;
    const PENCIL_OFFSET_Y = -50;

    // ✅ MOBILE
    if (isTouch) {
      return {
        x: clientX - rect.left + PENCIL_OFFSET_X,
        y: clientY - rect.top + PENCIL_OFFSET_Y,
      };
    }

    // ✅ DESKTOP
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // ---------------- DRAW (unchanged logic) ----------------
  const startDraw = (e: any) => {
    const point = getPoint(e);

    if (isMobile.current && "touches" in e) {
      const touch = e.touches[0];
      setPencilPos({ x: touch.clientX, y: touch.clientY });
    }

    const stroke: Stroke = {
      points: [point],
      color,
      size,
    };

    setCurrentStroke(stroke);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing || !currentStroke) return;

    const point = getPoint(e);

    // Update pencil overlay position on mobile
    if (isMobile.current && "touches" in e) {
      const touch = e.touches[0];
      setPencilPos({ x: touch.clientX, y: touch.clientY });
    }

    const updated = {
      ...currentStroke,
      points: [...currentStroke.points, point],
    };

    setCurrentStroke(updated);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const pts = updated.points;

    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing || !currentStroke) return;

    setStrokes((prev) => [...prev, currentStroke]);
    setRedoStack([]);
    setCurrentStroke(null);
    setIsDrawing(false);
    // Hide pencil when finger lifts
    if (isMobile.current) setPencilPos(null);
  };

  // ---------------- ACTIONS (unchanged logic) ----------------
  const undo = () => {
    if (!strokes.length) return;
    const newStrokes = [...strokes];
    const last = newStrokes.pop()!;
    setStrokes(newStrokes);
    setRedoStack((r) => [...r, last]);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setStrokes((s) => [...s, last]);
  };

  const clear = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "kids-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ---------------- FULLSCREEN ----------------
  const enterFullscreen = () => {
    setIsFullscreen(true);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => { });
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
    else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
  };

  // sync if user presses Escape key natively
  useEffect(() => {
    const onFSChange = () => {
      const fsEl =
        document.fullscreenElement || (document as any).webkitFullscreenElement;
      if (!fsEl) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
    };
  }, []);

  // ---------------- TOOLBAR (shared between normal & fullscreen) ----------------
  const ToolbarContent = (
    <>
      {/* COLOR SWATCHES */}
      <div style={styles.row}>
        {COLORS.map((c, i) => (
          <div
            key={i}
            onClick={() => setColor(c)}
            style={{
              ...styles.color,
              background: c,
              border:
                color === c
                  ? "3px solid #000"
                  : c === "rgb(255, 255, 255)" || c === "rgb(250, 250, 250)"
                    ? "1px solid #ccc"
                    : "1px solid transparent",
              transform: color === c ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* SIZE + BUTTONS */}
      <div style={{ ...styles.row, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: isFullscreen ? "#eee" : "#555" }}>
            Size
          </span>
          <input
            type="range"
            min={2}
            max={30}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: 100 }}
          />
          {/* live brush preview dot */}
          <div
            style={{
              width: Math.min(size, 24),
              height: Math.min(size, 24),
              borderRadius: "50%",
              background: color,
              border: "1px solid #999",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={undo}
            style={{
              ...styles.kidBtn,
              background: "linear-gradient(135deg,#93C5FD,#3B82F6)",
            }}
          >
            ↩ Undo
          </button>

          <button
            onClick={redo}
            style={{
              ...styles.kidBtn,
              background: "linear-gradient(135deg,#A5B4FC,#6366F1)",
            }}
          >
            ↪ Redo
          </button>

          <button
            onClick={clear}
            style={{
              ...styles.kidBtn,
              background: "linear-gradient(135deg,#FCA5A5,#EF4444)",
            }}
          >
            🗑 Clear
          </button>

          <button
            onClick={download}
            style={{
              ...styles.kidBtn,
              background: "linear-gradient(135deg,#86EFAC,#22C55E)",
            }}
          >
            💾 Save
          </button>

          {!isFullscreen ? (
            <button
              onClick={enterFullscreen}
              style={{
                ...styles.kidBtn,
                background: "linear-gradient(135deg,#D8B4FE,#A855F7)",
              }}
            >
              ⛶ Fullscreen
            </button>
          ) : (
            <button
              onClick={exitFullscreen}
              style={{
                ...styles.kidBtn,
                background: "linear-gradient(135deg,#F9A8D4,#EC4899)",
              }}
            >
              ✕ Exit
            </button>
          )}
        </div>
      </div>
    </>
  );

  // ---------------- RENDER ----------------
  return (
    <div
      style={{
        ...styles.container,
        ...(isFullscreen
          ? {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            minHeight: "100dvh",
            background: "#1a1a2e",
            padding: 0,
          }
          : {}),
      }}
    >
      {/* ---- TITLE (hidden in fullscreen) ---- */}
      {!isFullscreen && <h1 style={styles.title}>🎨 Kids Drawing Board</h1>}

      {/* ---- TOOLBAR ---- */}
      <div
        style={
          isFullscreen
            ? {
              ...styles.fsToolbar,
            }
            : { marginBottom: 12 }
        }
      >
        {ToolbarContent}
      </div>

      {/* ---- CANVAS WRAPPER ---- */}
      <div
        ref={canvasWrapRef}
        style={
          isFullscreen
            ? styles.fsCanvasWrap
            : {
              ...styles.canvasWrap,
              border: "4px solid #93C5FD",
              borderRadius: 20,
            }
        }
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            position: "absolute",
            left: 0,
            top: 0,
            background: "#fff",
            touchAction: "none",
            cursor: isMobile.current ? "none" : "crosshair",
          }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* ---- MOBILE PENCIL CURSOR OVERLAY ---- */}
      {isMobile.current && pencilPos && (
        <div
          style={{
            position: "fixed",
            // Offset so the pencil tip (bottom-left of emoji) aligns with touch point
            left: pencilPos.x - 6,
            top: pencilPos.y - 100,
            fontSize: 50,
            lineHeight: 1,
            pointerEvents: "none",   // never blocks touch events
            zIndex: 99999,
            userSelect: "none",
            transform: "scaleX(-1)", // flip so tip points down-left naturally
          }}
          aria-hidden="true"
        >
          ✏️
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%   { transform: translateX(0); }
          25%  { transform: translateX(-10px); }
          50%  { transform: translateX(10px); }
          75%  { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    padding: "16px",
    textAlign: "center",
    fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive',
    background: "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "2rem",
    marginBottom: 12,
    color: '#3c3c3d'
  },

  row: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },

  color: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    cursor: "pointer",
    flexShrink: 0,
    transition: "transform 0.1s",
  },

  btn: {
    padding: "7px 13px",
    borderRadius: 10,
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },

  btnGreen: {
    padding: "7px 13px",
    borderRadius: 10,
    border: "none",
    background: "#22C55E",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },

  btnPurple: {
    padding: "7px 13px",
    borderRadius: 10,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },

  btnExit: {
    padding: "7px 13px",
    borderRadius: 10,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },

  // Normal mode: canvas fills remaining vertical space.
  // position:relative contains the absolute canvas without being resized by it.
  canvasWrap: {
    position: "relative",
    flex: 1,
    minHeight: 300,
    width: "100%",
  },

  // Fullscreen: slim dark toolbar at top, canvas below
  fsToolbar: {
    padding: "8px 12px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    flexShrink: 0,
  },

  fsCanvasWrap: {
    position: "relative",
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  kidBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 16,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.95rem",
    boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
    transition: "all 0.2s ease",
    fontFamily: '"Comic Sans MS", cursive',
  },
};

export default KidDrawingApp;