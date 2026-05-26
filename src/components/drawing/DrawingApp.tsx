import React, { useRef, useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Point = { x: number; y: number };

type ShapeType =
  | "freehand"
  | "circle"
  | "square"
  | "star"
  | "rhombus"
  | "parallelogram"
  | "spray"
  | "fill"
  | "gradient-fill"; // NEW: gradient flood fill

type ShapeStroke = {
  type: ShapeType;
  start: Point;
  end: Point;
  color: string;
  size: number;
  points?: Point[];
  sprayDots?: Point[];
  gradientId?: string; // NEW: which gradient preset was used
};

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = [
  "rgb(239,68,68)",   "rgb(244,63,94)",  "rgb(248,113,113)",
  "rgb(59,130,246)",  "rgb(99,102,241)", "rgb(6,182,212)",
  "rgb(34,197,94)",   "rgb(20,184,166)", "rgb(132,204,22)",
  "rgb(234,179,8)",   "rgb(251,191,36)", "rgb(249,115,22)",
  "rgb(168,85,247)",  "rgb(147,51,234)", "rgb(236,72,153)",
  "rgb(17,24,39)",    "rgb(107,114,128)","rgb(229,231,235)",
  "rgb(255,255,255)", "rgb(120,53,15)",  "rgb(180,83,9)",
  "rgb(217,119,6)",   "rgb(14,165,233)", "rgb(124,58,237)",
  "rgb(244,114,182)",
];

// ─── Gradient presets ─────────────────────────────────────────────────────────
type GradientPreset = {
  id: string;
  label: string;
  stops: string[];        // rgb strings
  direction: "linear-h" | "linear-v" | "linear-d" | "radial";
  css: string;            // CSS for swatch preview only
};

const GRADIENTS: GradientPreset[] = [
  { id: "sunset",    label: "Sunset",    stops: ["rgb(255,94,77)","rgb(255,154,0)","rgb(255,206,84)"],   direction: "linear-h", css: "linear-gradient(135deg,#FF5E4D,#FF9A00,#FFCE54)" },
  { id: "ocean",     label: "Ocean",     stops: ["rgb(6,182,212)","rgb(59,130,246)","rgb(99,102,241)"],  direction: "linear-d", css: "linear-gradient(135deg,#06B6D4,#3B82F6,#6366F1)" },
  { id: "forest",    label: "Forest",    stops: ["rgb(34,197,94)","rgb(20,184,166)","rgb(132,204,22)"],  direction: "linear-v", css: "linear-gradient(180deg,#22C55E,#14B8A6,#84CC16)" },
  { id: "candy",     label: "Candy",     stops: ["rgb(236,72,153)","rgb(168,85,247)","rgb(99,102,241)"], direction: "linear-h", css: "linear-gradient(90deg,#EC4899,#A855F7,#6366F1)" },
  { id: "fire",      label: "Fire",      stops: ["rgb(239,68,68)","rgb(249,115,22)","rgb(234,179,8)"],   direction: "linear-v", css: "linear-gradient(180deg,#EF4444,#F97316,#EAB308)" },
  { id: "sky",       label: "Sky",       stops: ["rgb(186,230,253)","rgb(96,165,250)","rgb(29,78,216)"], direction: "linear-v", css: "linear-gradient(180deg,#BAE6FD,#60A5FA,#1D4ED8)" },
  { id: "rose",      label: "Rose",      stops: ["rgb(255,228,230)","rgb(244,114,182)","rgb(190,24,93)"],direction: "radial",   css: "radial-gradient(circle,#FFE4E6,#F472B6,#BE185D)" },
  { id: "gold",      label: "Gold",      stops: ["rgb(254,243,199)","rgb(251,191,36)","rgb(180,83,9)"],  direction: "radial",   css: "radial-gradient(circle,#FEF3C7,#FBBF24,#B45309)" },
  { id: "mint",      label: "Mint",      stops: ["rgb(209,250,229)","rgb(52,211,153)","rgb(4,120,87)"],  direction: "linear-d", css: "linear-gradient(135deg,#D1FAE5,#34D399,#047857)" },
  { id: "aurora",    label: "Aurora",    stops: ["rgb(167,243,208)","rgb(134,239,172)","rgb(59,130,246)","rgb(168,85,247)"], direction: "linear-h", css: "linear-gradient(90deg,#A7F3D0,#86EFAC,#3B82F6,#A855F7)" },
  { id: "volcano",   label: "Volcano",   stops: ["rgb(17,24,39)","rgb(127,29,29)","rgb(239,68,68)"],     direction: "radial",   css: "radial-gradient(circle,#111827,#7F1D1D,#EF4444)" },
  { id: "grape",     label: "Grape",     stops: ["rgb(245,243,255)","rgb(196,181,253)","rgb(109,40,217)"],direction: "linear-d", css: "linear-gradient(135deg,#F5F3FF,#C4B5FD,#6D28D9)" },
];

// Shape toolbar
const SHAPES: { type: ShapeType; label: string; icon: string }[] = [
  { type: "freehand",       label: "Pen",       icon: "✏️" },
  { type: "spray",          label: "Spray",     icon: "🫧" },
  { type: "fill",           label: "Fill",      icon: "🪣" },
  { type: "gradient-fill",  label: "Gradient",  icon: "🌈" },
  { type: "circle",         label: "Circle",    icon: "⭕" },
  { type: "square",         label: "Square",    icon: "⬛" },
  { type: "star",           label: "Star",      icon: "⭐" },
  { type: "rhombus",        label: "Rhombus",   icon: "🔷" },
  { type: "parallelogram",  label: "Parallel",  icon: "▱" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseRgb(rgb: string): { r: number; g: number; b: number } {
  const m = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: +m[1], g: +m[2], b: +m[3] };
}
function toRgbStr(r: number, g: number, b: number) { return `rgb(${r},${g},${b})`; }
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}

// ─── Gradient flood fill ──────────────────────────────────────────────────────
/**
 * 1. Flood-fill to find the connected region (same algorithm as solid fill).
 * 2. Build a bounding box of affected pixels.
 * 3. Overlay a gradient that covers the bounding box, clipped to only the
 *    filled region using a mask approach (draw gradient onto off-screen canvas,
 *    copy per-pixel only where region was filled).
 */
function gradientFloodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  preset: GradientPreset,
  canvasW: number,
  canvasH: number
) {
  const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data    = imgData.data;

  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || px >= canvasW || py < 0 || py >= canvasH) return;
  const startIdx = (py * canvasW + px) * 4;

  const sr = data[startIdx], sg = data[startIdx+1], sb = data[startIdx+2], sa = data[startIdx+3];

  const tolerance = 30;
  const matches = (i: number) =>
    Math.abs(data[i]-sr) <= tolerance &&
    Math.abs(data[i+1]-sg) <= tolerance &&
    Math.abs(data[i+2]-sb) <= tolerance &&
    Math.abs(data[i+3]-sa) <= tolerance;

  // BFS to collect all pixels in region
  const visited  = new Uint8Array(canvasW * canvasH);
  const region: number[] = [];
  const stack = [startIdx / 4];
  let minX = px, maxX = px, minY = py, maxY = py;

  while (stack.length) {
    const pos = stack.pop()!;
    if (visited[pos]) continue;
    visited[pos] = 1;
    const i = pos * 4;
    if (!matches(i)) continue;
    region.push(pos);
    const rx = pos % canvasW, ry = Math.floor(pos / canvasW);
    if (rx < minX) minX = rx; if (rx > maxX) maxX = rx;
    if (ry < minY) minY = ry; if (ry > maxY) maxY = ry;
    if (rx > 0)           stack.push(pos - 1);
    if (rx < canvasW - 1) stack.push(pos + 1);
    if (ry > 0)           stack.push(pos - canvasW);
    if (ry < canvasH - 1) stack.push(pos + canvasW);
  }

  if (region.length === 0) return;

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;

  // Build gradient colors for each pixel using linear interpolation across stops
  const stops = preset.stops.map(parseRgb);
  const getGradColor = (nx: number, ny: number): { r: number; g: number; b: number } => {
    // normalized 0–1 position along gradient axis
    let t = 0;
    if (preset.direction === "linear-h")  t = bw > 1 ? nx / (bw - 1) : 0;
    else if (preset.direction === "linear-v") t = bh > 1 ? ny / (bh - 1) : 0;
    else if (preset.direction === "linear-d") t = (bw + bh > 2) ? (nx / (bw - 1 || 1) + ny / (bh - 1 || 1)) / 2 : 0;
    else { // radial
      const cx2 = bw / 2, cy2 = bh / 2;
      const maxR = Math.sqrt(cx2 * cx2 + cy2 * cy2);
      t = maxR > 0 ? Math.min(Math.sqrt((nx - cx2) ** 2 + (ny - cy2) ** 2) / maxR, 1) : 0;
    }
    t = Math.max(0, Math.min(1, t));
    const seg    = (stops.length - 1) * t;
    const lo     = Math.floor(seg);
    const hi     = Math.min(lo + 1, stops.length - 1);
    const frac   = seg - lo;
    const a = stops[lo], b2 = stops[hi];
    return {
      r: Math.round(a.r + (b2.r - a.r) * frac),
      g: Math.round(a.g + (b2.g - a.g) * frac),
      b: Math.round(a.b + (b2.b - a.b) * frac),
    };
  };

  // Paint gradient onto filled region
  for (const pos of region) {
    const rx = pos % canvasW - minX;
    const ry = Math.floor(pos / canvasW) - minY;
    const { r, g, b } = getGradColor(rx, ry);
    const i = pos * 4;
    data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
}

// ─── Solid flood fill ─────────────────────────────────────────────────────────
function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fillColor: string,
  canvasW: number,
  canvasH: number
) {
  const { r: fr, g: fg, b: fb } = parseRgb(fillColor);
  const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data    = imgData.data;
  const px = Math.round(x), py = Math.round(y);
  if (px < 0 || px >= canvasW || py < 0 || py >= canvasH) return;
  const idx = (py * canvasW + px) * 4;
  const sr = data[idx], sg = data[idx+1], sb = data[idx+2], sa = data[idx+3];
  if (sr === fr && sg === fg && sb === fb) return;
  const tolerance = 30;
  const matches = (i: number) =>
    Math.abs(data[i]-sr) <= tolerance && Math.abs(data[i+1]-sg) <= tolerance &&
    Math.abs(data[i+2]-sb) <= tolerance && Math.abs(data[i+3]-sa) <= tolerance;
  const stack: number[] = [idx / 4];
  const visited = new Uint8Array(canvasW * canvasH);
  while (stack.length) {
    const pos = stack.pop()!;
    if (visited[pos]) continue;
    visited[pos] = 1;
    const i = pos * 4;
    if (!matches(i)) continue;
    data[i] = fr; data[i+1] = fg; data[i+2] = fb; data[i+3] = 255;
    const px2 = pos % canvasW, py2 = Math.floor(pos / canvasW);
    if (px2 > 0)           stack.push(pos - 1);
    if (px2 < canvasW - 1) stack.push(pos + 1);
    if (py2 > 0)           stack.push(pos - canvasW);
    if (py2 < canvasH - 1) stack.push(pos + canvasW);
  }
  ctx.putImageData(imgData, 0, 0);
}

// ─── Shape drawing ────────────────────────────────────────────────────────────
function drawShapeOnCtx(ctx: CanvasRenderingContext2D, shape: ShapeStroke, preview = false) {
  const { type, start, end, color, size, points, sprayDots } = shape;
  if (preview) ctx.globalAlpha = 0.55;

  if (type === "spray") {
    ctx.fillStyle = color;
    (sprayDots ?? []).forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, size*0.4, 0, Math.PI*2); ctx.fill(); });
    ctx.globalAlpha = 1; return;
  }
  if (type === "fill" || type === "gradient-fill") { ctx.globalAlpha = 1; return; }

  ctx.strokeStyle = color;
  ctx.lineWidth   = size;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const dx = end.x - start.x, dy = end.y - start.y;
  const cx = (start.x + end.x) / 2, cy = (start.y + end.y) / 2;
  ctx.beginPath();
  switch (type) {
    case "freehand":
      if (!points || points.length < 2) break;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      break;
    case "circle": { const r = Math.sqrt(dx*dx+dy*dy)/2; ctx.arc(cx, cy, Math.max(r,1), 0, Math.PI*2); break; }
    case "square": { const side = Math.min(Math.abs(dx),Math.abs(dy))*Math.sign(dx); ctx.rect(start.x, start.y, side, side*Math.sign(dy)); break; }
    case "star": {
      const oR = Math.sqrt(dx*dx+dy*dy)/2, iR = oR*0.42;
      for (let i = 0; i < 10; i++) {
        const a = i*Math.PI/5 - Math.PI/2, r2 = i%2===0 ? oR : iR;
        const px = cx+r2*Math.cos(a), py = cy+r2*Math.sin(a);
        if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); break;
    }
    case "rhombus": {
      const hw = Math.abs(dx)/2, hh = Math.abs(dy)/2;
      ctx.moveTo(cx,cy-hh); ctx.lineTo(cx+hw,cy); ctx.lineTo(cx,cy+hh); ctx.lineTo(cx-hw,cy); ctx.closePath(); break;
    }
    case "parallelogram": {
      const sk = Math.abs(dx)*0.22;
      ctx.moveTo(start.x+sk,start.y); ctx.lineTo(start.x+dx,start.y);
      ctx.lineTo(start.x+dx-sk,start.y+dy); ctx.lineTo(start.x,start.y+dy); ctx.closePath(); break;
    }
  }
  ctx.stroke(); ctx.globalAlpha = 1;
}

// ─── RGB Picker ───────────────────────────────────────────────────────────────
const RgbPicker: React.FC<{ color: string; onChange: (c: string) => void; isDark: boolean }> = ({ color, onChange, isDark }) => {
  const { r, g, b } = parseRgb(color);
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: "bold", color: isDark ? "#ccc" : "#555", minWidth: 10 };
  const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6 };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, padding:"8px 12px", background: isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.05)", borderRadius:14, minWidth:220 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:color, border:"2px solid rgba(0,0,0,0.2)", flexShrink:0 }} />
        <input type="color" value={rgbToHex(r,g,b)} onChange={(e)=>{ const {r:nr,g:ng,b:nb}=hexToRgb(e.target.value); onChange(toRgbStr(nr,ng,nb)); }}
          style={{ width:36, height:30, border:"none", borderRadius:6, cursor:"pointer", padding:0, background:"transparent" }} title="Color wheel" />
        <span style={{ ...lbl, fontSize:10 }}>{rgbToHex(r,g,b).toUpperCase()}</span>
      </div>
      <div style={row}><span style={{ ...lbl, color:"#ef4444" }}>R</span><input type="range" min={0} max={255} value={r} onChange={(e)=>onChange(toRgbStr(+e.target.value,g,b))} style={{ flex:1, accentColor:"#ef4444" }} /><span style={{ ...lbl, minWidth:28, textAlign:"right" }}>{r}</span></div>
      <div style={row}><span style={{ ...lbl, color:"#22c55e" }}>G</span><input type="range" min={0} max={255} value={g} onChange={(e)=>onChange(toRgbStr(r,+e.target.value,b))} style={{ flex:1, accentColor:"#22c55e" }} /><span style={{ ...lbl, minWidth:28, textAlign:"right" }}>{g}</span></div>
      <div style={row}><span style={{ ...lbl, color:"#3b82f6" }}>B</span><input type="range" min={0} max={255} value={b} onChange={(e)=>onChange(toRgbStr(r,g,+e.target.value))} style={{ flex:1, accentColor:"#3b82f6" }} /><span style={{ ...lbl, minWidth:28, textAlign:"right" }}>{b}</span></div>
    </div>
  );
};

// ─── Gradient Picker ──────────────────────────────────────────────────────────
const GradientPicker: React.FC<{
  selected: string;
  onSelect: (id: string) => void;
  isDark: boolean;
}> = ({ selected, onSelect, isDark }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", padding:"8px 12px",
    background: isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.05)", borderRadius:14 }}>
    {GRADIENTS.map((g) => (
      <div key={g.id} onClick={() => onSelect(g.id)} title={g.label}
        style={{
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          cursor:"pointer",
        }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: g.css,
          border: selected === g.id ? "3px solid #1D4ED8" : "2px solid rgba(0,0,0,0.15)",
          transform: selected === g.id ? "scale(1.18)" : "scale(1)",
          transition: "all 0.15s",
          boxShadow: selected === g.id ? "0 0 0 2px #BFDBFE" : "none",
        }} />
        <span style={{ fontSize: 9, color: isDark?"#ccc":"#555", fontWeight:"bold" }}>{g.label}</span>
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const KidDrawingApp: React.FC = () => {
  const canvasRef     = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const sprayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapshotsRef  = useRef<Map<number, ImageData>>(new Map());

  const [strokes,   setStrokes]   = useState<ShapeStroke[]>([]);
  const [redoStack, setRedoStack] = useState<ShapeStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [color,       setColor]       = useState(PALETTE[3]);
  const [size,        setSize]        = useState(6);
  const [shape,       setShape]       = useState<ShapeType>("freehand");
  const [gradientId,  setGradientId]  = useState<string>(GRADIENTS[0].id); // active gradient preset

  const [showRgb,      setShowRgb]      = useState(false);
  const [showGradient, setShowGradient] = useState(false); // gradient picker panel

  const [currentStroke, setCurrentStroke] = useState<ShapeStroke | null>(null);
  const [isFullscreen,  setIsFullscreen]  = useState(false);

  const isMobile = useRef(
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
  const [pencilPos, setPencilPos] = useState<{ x: number; y: number } | null>(null);

  // ── When gradient-fill tool is selected, auto-open gradient picker ──────────
  useEffect(() => {
    if (shape === "gradient-fill") setShowGradient(true);
    else setShowGradient(false);
  }, [shape]);

  // ── drawAll ───────────────────────────────────────────────────────────────
  const drawAll = useCallback((strokeList?: ShapeStroke[]) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width/dpr, canvas.height/dpr);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width/dpr, canvas.height/dpr);
    const list = strokeList ?? strokes;
    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (s.type === "fill" || s.type === "gradient-fill") {
        const snap = snapshotsRef.current.get(i);
        if (snap) ctx.putImageData(snap, 0, 0);
      } else {
        drawShapeOnCtx(ctx, s);
      }
    }
  }, [strokes]);

  // ── resizeCanvas ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback((w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas || w === 0 || h === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    drawAll();
  }, [drawAll]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) { const { width, height } = e.contentRect; resizeCanvas(Math.floor(width), Math.floor(height)); }
    });
    ro.observe(wrap); return () => ro.disconnect();
  }, [resizeCanvas]);

  useEffect(() => { drawAll(); }, [strokes]);

  // ── getPoint ──────────────────────────────────────────────────────────────
  const getPoint = (e: any): Point => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    if (isTouch) return { x: clientX - rect.left, y: clientY - rect.top };
    // if (isTouch) return { x: clientX - rect.left - 6, y: clientY - rect.top - 50 };
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // ── Spray helpers ─────────────────────────────────────────────────────────
  const generateSprayDots = (cx: number, cy: number, brushSize: number): Point[] => {
    const dots: Point[] = [];
    const count = Math.max(8, brushSize * 3), radius = brushSize * 3;
    for (let i = 0; i < count; i++) {
      const angle = Math.random()*Math.PI*2, dist = Math.random()*radius;
      dots.push({ x: cx+dist*Math.cos(angle), y: cy+dist*Math.sin(angle) });
    }
    return dots;
  };
  const paintSprayDots = (dots: Point[], ctx: CanvasRenderingContext2D, c: string, sz: number) => {
    ctx.fillStyle = c;
    dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, sz*0.4, 0, Math.PI*2); ctx.fill(); });
  };

  // ── applyFill (solid or gradient) ─────────────────────────────────────────
  const applyFill = (point: Point) => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const dpr    = window.devicePixelRatio || 1;

    if (shape === "gradient-fill") {
      const preset = GRADIENTS.find((g) => g.id === gradientId) ?? GRADIENTS[0];
      gradientFloodFill(ctx, point.x * dpr, point.y * dpr, preset, canvas.width, canvas.height);
    } else {
      floodFill(ctx, point.x * dpr, point.y * dpr, color, canvas.width, canvas.height);
    }

    const snap     = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newIndex = strokes.length;
    snapshotsRef.current.set(newIndex, snap);

    const fillStroke: ShapeStroke = {
      type: shape as "fill" | "gradient-fill",
      start: point, end: point, color, size,
      gradientId: shape === "gradient-fill" ? gradientId : undefined,
    };
    setStrokes((prev) => [...prev, fillStroke]);
    setRedoStack([]);
  };

  // ── startDraw ─────────────────────────────────────────────────────────────
  const startDraw = (e: any) => {
    const point = getPoint(e);
    if (isMobile.current && "touches" in e)
      setPencilPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    if (shape === "fill" || shape === "gradient-fill") { applyFill(point); return; }

    if (shape === "spray") {
      const s: ShapeStroke = { type:"spray", start:point, end:point, color, size, sprayDots:[] };
      setCurrentStroke(s); setIsDrawing(true);
      const ctx = canvasRef.current!.getContext("2d")!;
      sprayTimerRef.current = setInterval(() => {
        setCurrentStroke((prev) => {
          if (!prev) return prev;
          const newDots = generateSprayDots(prev.end.x, prev.end.y, size);
          paintSprayDots(newDots, ctx, color, size);
          return { ...prev, sprayDots: [...(prev.sprayDots??[]), ...newDots] };
        });
      }, 30);
      return;
    }

    const s: ShapeStroke = { type:shape, start:point, end:point, color, size, points: shape==="freehand"?[point]:undefined };
    setCurrentStroke(s); setIsDrawing(true);
  };

  // ── draw ──────────────────────────────────────────────────────────────────
  const draw = (e: any) => {
    if (!isDrawing || !currentStroke) return;
    const point = getPoint(e);
    if (isMobile.current && "touches" in e)
      setPencilPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    if (shape === "spray") { setCurrentStroke((prev) => prev ? { ...prev, end:point } : prev); return; }
    const updated: ShapeStroke = shape==="freehand"
      ? { ...currentStroke, end:point, points:[...(currentStroke.points??[]),point] }
      : { ...currentStroke, end:point };
    setCurrentStroke(updated);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawAll(); drawShapeOnCtx(ctx, updated, true);
  };

  // ── endDraw ───────────────────────────────────────────────────────────────
  const endDraw = () => {
    if (!isDrawing || !currentStroke) return;
    if (sprayTimerRef.current) { clearInterval(sprayTimerRef.current); sprayTimerRef.current = null; }
    setStrokes((prev) => [...prev, currentStroke]);
    setRedoStack([]); setCurrentStroke(null); setIsDrawing(false);
    if (isMobile.current) setPencilPos(null);
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const undo = () => {
    if (!strokes.length) return;
    const copy = [...strokes]; const last = copy.pop()!;
    if (last.type === "fill" || last.type === "gradient-fill") snapshotsRef.current.delete(copy.length);
    setStrokes(copy); setRedoStack((r) => [...r, last]);
  };
  const redo = () => {
    if (!redoStack.length) return;
    const last = redoStack[redoStack.length-1];
    setRedoStack((r) => r.slice(0,-1)); setStrokes((s) => [...s, last]);
  };
  const clear = () => { setStrokes([]); setRedoStack([]); snapshotsRef.current.clear(); };
  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement("a"); link.download = "kids-drawing.png";
    link.href = canvas.toDataURL("image/png"); link.click();
  };

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const enterFullscreen = () => {
    setIsFullscreen(true); const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
  };
  const exitFullscreen = () => {
    setIsFullscreen(false);
    if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
    else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
  };
  useEffect(() => {
    const fn = () => { const fsEl = document.fullscreenElement||(document as any).webkitFullscreenElement; if (!fsEl) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", fn); document.addEventListener("webkitfullscreenchange", fn);
    return () => { document.removeEventListener("fullscreenchange", fn); document.removeEventListener("webkitfullscreenchange", fn); };
  }, []);

  const getCursor = () => {
    if (isMobile.current) return "none";
    if (shape === "fill" || shape === "gradient-fill") return "cell";
    return "crosshair";
  };

  // ── Active gradient preset label for indicator ────────────────────────────
  const activeGradient = GRADIENTS.find((g) => g.id === gradientId)!;

  // ── Toolbar ───────────────────────────────────────────────────────────────
  const ToolbarContent = (
    <>
      {/* PALETTE */}
      <div style={st.row}>
        {PALETTE.map((c, i) => (
          <div key={i} onClick={() => { setColor(c); if (shape==="gradient-fill") setShape("fill"); }}
            style={{ ...st.swatch, background:c,
              border: color===c && shape!=="gradient-fill" ? "3px solid #000" : c.includes("255, 255, 255")||c.includes("250, 250, 250") ? "1px solid #ccc" : "1px solid transparent",
              transform: color===c && shape!=="gradient-fill" ? "scale(1.25)" : "scale(1)" }} />
        ))}
        {/* Rainbow toggle → RGB picker */}
        <div onClick={() => setShowRgb((v)=>!v)} title="Custom RGB"
          style={{ ...st.swatch, background:"conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
            border: showRgb?"3px solid #000":"1px solid #aaa", transform: showRgb?"scale(1.25)":"scale(1)", cursor:"pointer" }} />
      </div>

      {/* RGB picker panel */}
      {showRgb && (
        <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
          <RgbPicker color={color} onChange={(c)=>{ setColor(c); if(shape==="gradient-fill") setShape("fill"); }} isDark={isFullscreen} />
        </div>
      )}

      {/* SHAPE / TOOL BUTTONS */}
      <div style={{ ...st.row, gap:6, marginBottom:8 }}>
        {SHAPES.map((sh) => (
          <button key={sh.type} title={sh.label} onClick={() => setShape(sh.type)}
            style={{ ...st.shapeBtn,
              background: shape===sh.type ? "linear-gradient(135deg,#60A5FA,#3B82F6)" : isFullscreen ? "rgba(255,255,255,0.12)" : "#E2E8F0",
              color: shape===sh.type ? "#fff" : isFullscreen ? "#ddd" : "#334155",
              boxShadow: shape===sh.type ? "0 4px 0 #1D4ED8" : "0 3px 0 #94A3B8",
              transform: shape===sh.type ? "translateY(2px)" : "translateY(0)",
            }}>
            <span style={{ fontSize:"1.15rem" }}>{sh.icon}</span>
            <span style={{ fontSize:"0.62rem", marginTop:1 }}>{sh.label}</span>
          </button>
        ))}
      </div>

      {/* GRADIENT PICKER PANEL — shown when gradient-fill tool is active */}
      {showGradient && (
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:11, color: isFullscreen?"#ccc":"#555", marginBottom:6, fontWeight:"bold" }}>
            🌈 Select Gradient — active: <span style={{ color:"#3B82F6" }}>{activeGradient.label}</span>
          </div>
          <GradientPicker selected={gradientId} onSelect={setGradientId} isDark={isFullscreen} />
        </div>
      )}

      {/* SIZE + ACTIONS */}
      <div style={{ ...st.row, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:13, color: isFullscreen?"#eee":"#555" }}>Size</span>
          <input type="range" min={2} max={30} value={size} onChange={(e)=>setSize(Number(e.target.value))} style={{ width:100 }} />
          <div style={{ width:Math.min(size,24), height:Math.min(size,24), borderRadius:"50%",
            background: shape==="gradient-fill" ? activeGradient.css : color,
            border:"1px solid #999", flexShrink:0, transition:"all 0.15s" }} />
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={undo}     style={{ ...st.kidBtn, background:"linear-gradient(135deg,#93C5FD,#3B82F6)" }}>↩ Undo</button>
          <button onClick={redo}     style={{ ...st.kidBtn, background:"linear-gradient(135deg,#A5B4FC,#6366F1)" }}>↪ Redo</button>
          <button onClick={clear}    style={{ ...st.kidBtn, background:"linear-gradient(135deg,#FCA5A5,#EF4444)" }}>🗑 Clear</button>
          <button onClick={download} style={{ ...st.kidBtn, background:"linear-gradient(135deg,#86EFAC,#22C55E)" }}>💾 Save</button>
          {!isFullscreen
            ? <button onClick={enterFullscreen} style={{ ...st.kidBtn, background:"linear-gradient(135deg,#D8B4FE,#A855F7)" }}>⛶ Full</button>
            : <button onClick={exitFullscreen}  style={{ ...st.kidBtn, background:"linear-gradient(135deg,#F9A8D4,#EC4899)" }}>✕ Exit</button>
          }
        </div>
      </div>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...st.container, ...(isFullscreen?{ position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,minHeight:"100dvh",background:"#1a1a2e",padding:0 }:{}) }}>
      {!isFullscreen && <h1 style={st.title}>🎨 Kids Drawing Board</h1>}
      <div style={isFullscreen ? st.fsToolbar : { marginBottom:12 }}>{ToolbarContent}</div>
      <div ref={canvasWrapRef} style={isFullscreen ? st.fsCanvasWrap : { ...st.canvasWrap, border:"4px solid #93C5FD", borderRadius:20 }}>
        <canvas ref={canvasRef}
          style={{ display:"block", position:"absolute", left:0, top:0, background:"#fff", touchAction:"none", cursor:getCursor() }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
      </div>
      {isMobile.current && pencilPos && (
        <div style={{ position:"fixed", left:pencilPos.x-6, top:pencilPos.y-60, fontSize:50, lineHeight:1,
          pointerEvents:"none", zIndex:99999, userSelect:"none", transform:"scaleX(-1)" }} aria-hidden="true">✏️</div>
      )}
      <style>{`
        @keyframes shake { 0%{transform:translateX(0)} 25%{transform:translateX(-10px)} 50%{transform:translateX(10px)} 75%{transform:translateX(-10px)} 100%{transform:translateX(0)} }
        .shake-animation { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const st: Record<string, React.CSSProperties> = {
  container: { minHeight:"100vh", padding:"16px", textAlign:"center", fontFamily:'"Comic Sans MS","Chalkboard SE",cursive', background:"linear-gradient(135deg,#DBEAFE,#FEF9C3)", boxSizing:"border-box", display:"flex", flexDirection:"column" },
  title:     { fontSize:"2rem", marginBottom:12, color:"#3c3c3d" },
  row:       { display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, alignItems:"center", marginBottom:8 },
  swatch:    { width:24, height:24, borderRadius:"50%", cursor:"pointer", flexShrink:0, transition:"transform 0.1s" },
  shapeBtn:  { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:66, height:52, border:"none", borderRadius:12, cursor:"pointer", fontFamily:"inherit", fontWeight:"bold", transition:"all 0.15s" },
  canvasWrap:  { position:"relative", flex:1, minHeight:300, width:"100%" },
  fsToolbar:   { padding:"8px 12px", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", borderBottom:"1px solid rgba(255,255,255,0.1)", flexShrink:0 },
  fsCanvasWrap:{ position:"relative", flex:1, width:"100%", overflow:"hidden" },
  kidBtn:    { padding:"10px 16px", border:"none", borderRadius:16, color:"#fff", fontWeight:"bold", cursor:"pointer", fontSize:"0.95rem", boxShadow:"0 6px 0 rgba(0,0,0,0.15)", transition:"all 0.2s ease", fontFamily:'"Comic Sans MS",cursive' },
};

export default KidDrawingApp;