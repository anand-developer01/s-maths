import { useRef, useState, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// -------- LETTER SHAPE RULES (IMPORTANT PART) --------
// We classify strokes into simple directions:
// vertical, horizontal, diagonal, curve-ish (approx)

type StrokeType = "V" | "H" | "D" | "C";

const getStrokeType = (p1: Point, p2: Point): StrokeType => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // vertical
  if (absY > absX * 1.5) return "V";

  // horizontal
  if (absX > absY * 1.5) return "H";

  // diagonal
  if (absX > 20 && absY > 20) return "D";

  return "C";
};

// -------- LETTER EXPECTED SHAPES --------
const LETTER_SHAPES: Record<string, StrokeType[]> = {
  A: ["D", "D", "H"], // 2 diagonals + cross
  B: ["V", "C", "C"],
  C: ["C"],
  D: ["V", "C"],
  E: ["V", "H", "H", "H"],
  F: ["V", "H", "H"],
  I: ["V"],
  O: ["C"],
  T: ["H", "V"],
};

const Handwriting = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentLetter, setCurrentLetter] = useState("A");
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [message, setMessage] = useState("");

  const [canvasSize, setCanvasSize] = useState({
    width: 500,
    height: 500,
  });

  // responsive
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 768) {
        setCanvasSize({
          width: window.innerWidth - 30,
          height: 400,
        });
      } else {
        setCanvasSize({ width: 500, height: 500 });
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // draw background letter
  useEffect(() => {
    drawCanvas();
  }, [currentLetter, canvasSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // guide letter
    ctx.font = `bold ${canvas.width * 0.5}px Comic Sans MS`;
    ctx.fillStyle = "rgba(59,130,246,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentLetter, canvas.width / 2, canvas.height / 2);
  };

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: any) => {
    const pos = getPos(e);
    setDrawing(true);
    setPoints([pos]);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: any) => {
    if (!drawing) return;

    const pos = getPos(e);
    setPoints((p) => [...p, pos]);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!drawing) return;
    setDrawing(false);

    validateShape();
  };

  // -------- SHAPE MATCHING LOGIC --------
  const validateShape = () => {
    if (points.length < 10) {
      setMessage("❌ Try drawing properly");
      return;
    }

    const expected = LETTER_SHAPES[currentLetter];

    if (!expected) {
      setMessage("⚠️ No rule defined");
      return;
    }

    // convert strokes from points (simple segmentation)
    const strokes: StrokeType[] = [];

    for (let i = 1; i < points.length; i++) {
      const type = getStrokeType(points[i - 1], points[i]);
      strokes.push(type);
    }

    // compress strokes
    const compressed: StrokeType[] = [];
    for (let i = 0; i < strokes.length; i++) {
      if (i === 0 || strokes[i] !== strokes[i - 1]) {
        compressed.push(strokes[i]);
      }
    }

    // compare similarity (not strict)
    const matchCount = expected.filter((e) =>
      compressed.includes(e)
    ).length;

    const score = matchCount / expected.length;

    if (score >= 0.6) {
      setMessage("✅ Great Job!");
    } else {
      setMessage("❌ Try again slowly");
    }
  };

  const clearCanvas = () => {
    setPoints([]);
    setMessage("");
    drawCanvas();
  };

  const nextLetter = () => {
    const index = LETTERS.indexOf(currentLetter);
    setCurrentLetter(LETTERS[(index + 1) % LETTERS.length]);

    setPoints([]);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✍️ Handwriting Practice</h1>

        <div style={styles.badge}>{currentLetter}</div>

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={styles.canvas}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        {message && (
          <div style={styles.message}>{message}</div>
        )}

        <div style={styles.actions}>
          <button onClick={clearCanvas} style={styles.clearBtn}>
            Clear
          </button>

          <button onClick={nextLetter} style={styles.nextBtn}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    fontFamily: '"Comic Sans MS", cursive',
  },

  card: {
    width: "100%",
    maxWidth: 650,
    background: "#fff",
    borderRadius: 25,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },

  title: {
    fontSize: "2rem",
    marginBottom: 10,
  },

  badge: {
    fontSize: 80,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#3B82F6",
  },

  canvas: {
    width: "100%",
    border: "4px solid #BFDBFE",
    borderRadius: 20,
    touchAction: "none",
  },

  message: {
    marginTop: 15,
    fontSize: "1.5rem",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },

  clearBtn: {
    padding: "12px 25px",
    background: "#EF4444",
    color: "#fff",
    border: "none",
    borderRadius: 12,
  },

  nextBtn: {
    padding: "12px 25px",
    background: "#22C55E",
    color: "#fff",
    border: "none",
    borderRadius: 12,
  },
};

export default Handwriting;

































// import { useRef, useState, useEffect } from "react";

// const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// const Handwriting = () => {
//   const canvasRef = useRef(null);
//   const [currentLetter, setCurrentLetter] = useState("A");
//   const [drawing, setDrawing] = useState(false);
//   const [hasDrawing, setHasDrawing] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // "success" | "error" | "checking"
//   const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
//   const [score, setScore] = useState({ correct: 0, total: 0 });
//   const lastPoint = useRef(null);

//   useEffect(() => {
//     const resize = () => {
//       const w = window.innerWidth < 768 ? window.innerWidth - 40 : 500;
//       setCanvasSize({ width: w, height: w });
//     };
//     resize();
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   useEffect(() => {
//     drawGuide();
//   }, [currentLetter, canvasSize]);

//   const drawGuide = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     if (!canvas || !ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // white background
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // subtle grid lines
//     ctx.strokeStyle = "rgba(200, 200, 230, 0.4)";
//     ctx.lineWidth = 1;
//     const step = canvas.width / 4;
//     for (let i = 1; i < 4; i++) {
//       ctx.beginPath();
//       ctx.moveTo(i * step, 0);
//       ctx.lineTo(i * step, canvas.height);
//       ctx.stroke();
//       ctx.beginPath();
//       ctx.moveTo(0, i * step);
//       ctx.lineTo(canvas.width, i * step);
//       ctx.stroke();
//     }

//     // center crosshair guide
//     ctx.strokeStyle = "rgba(200, 200, 230, 0.6)";
//     ctx.setLineDash([6, 6]);
//     ctx.beginPath();
//     ctx.moveTo(canvas.width / 2, 0);
//     ctx.lineTo(canvas.width / 2, canvas.height);
//     ctx.stroke();
//     ctx.setLineDash([]);

//     // ghost guide letter
//     ctx.font = `bold ${canvas.width * 0.65}px Arial`;
//     ctx.fillStyle = "rgba(99, 102, 241, 0.08)";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(currentLetter, canvas.width / 2, canvas.height / 2);
//   };

//   const getPos = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
//     const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
//     return {
//       x: (clientX - rect.left) * (canvas.width / rect.width),
//       y: (clientY - rect.top) * (canvas.height / rect.height),
//     };
//   };

//   const startDraw = (e) => {
//     e.preventDefault();
//     const pos = getPos(e);
//     setDrawing(true);
//     setHasDrawing(true);
//     setMessage("");
//     setMessageType("");
//     lastPoint.current = pos;

//     const ctx = canvasRef.current?.getContext("2d");
//     if (!ctx) return;
//     ctx.beginPath();
//     ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
//     ctx.fillStyle = "#1e1b4b";
//     ctx.fill();
//   };

//   const draw = (e) => {
//     e.preventDefault();
//     if (!drawing) return;
//     const pos = getPos(e);
//     const ctx = canvasRef.current?.getContext("2d");
//     if (!ctx || !lastPoint.current) return;

//     ctx.beginPath();
//     ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
//     ctx.lineTo(pos.x, pos.y);
//     ctx.strokeStyle = "#1e1b4b";
//     ctx.lineWidth = Math.max(6, canvasSize.width / 70);
//     ctx.lineCap = "round";
//     ctx.lineJoin = "round";
//     ctx.stroke();

//     lastPoint.current = pos;
//   };

//   const stopDraw = (e) => {
//     if (e) e.preventDefault();
//     setDrawing(false);
//     lastPoint.current = null;
//   };

//   const checkWithAI = async () => {
//     const canvas = canvasRef.current;
//     if (!canvas || !hasDrawing) return;

//     setMessage("Checking your drawing...");
//     setMessageType("checking");

//     // capture canvas as base64 image
//     const imageData = canvas.toDataURL("image/png").split(",")[1];

//     try {
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 200,
//           messages: [
//             {
//               role: "user",
//               content: [
//                 {
//                   type: "image",
//                   source: { type: "base64", media_type: "image/png", data: imageData },
//                 },
//                 {
//                   type: "text",
//                   text: `A child is learning to write the letter "${currentLetter}". Look at what they drew on this canvas (there's a faint blue guide letter in the background — ignore it, only judge the dark ink strokes the child drew).

// Does the dark drawing resemble the letter "${currentLetter}"? Be generous and encouraging — this is for young children (ages 4-7) who are just learning. A rough attempt that has the basic shape counts.

// Respond in this exact JSON format only:
// {"recognized": true/false, "confidence": "high"/"medium"/"low", "encouragement": "a short friendly message for a child (max 8 words)"}`,
//                 },
//               ],
//             },
//           ],
//         }),
//       });

//       const data = await response.json();
//       const text = data.content?.map((b) => b.text || "").join("") || "";

//       let result;
//       try {
//         const clean = text.replace(/```json|```/g, "").trim();
//         result = JSON.parse(clean);
//       } catch {
//         result = { recognized: text.toLowerCase().includes("yes") || text.toLowerCase().includes("true"), encouragement: "Keep trying!" };
//       }

//       setScore((s) => ({
//         correct: s.correct + (result.recognized ? 1 : 0),
//         total: s.total + 1,
//       }));

//       if (result.recognized) {
//         setMessage(`⭐ ${result.encouragement || "Great job!"}`);
//         setMessageType("success");
//       } else {
//         setMessage(`✏️ ${result.encouragement || "Try again, you can do it!"}`);
//         setMessageType("error");
//       }
//     } catch (err) {
//       setMessage("Could not check — please try again.");
//       setMessageType("error");
//     }
//   };

//   const clearCanvas = () => {
//     setHasDrawing(false);
//     setMessage("");
//     setMessageType("");
//     drawGuide();
//   };

//   const nextLetter = () => {
//     const idx = LETTERS.indexOf(currentLetter);
//     setCurrentLetter(LETTERS[(idx + 1) % LETTERS.length]);
//     setHasDrawing(false);
//     setMessage("");
//     setMessageType("");
//   };

//   const prevLetter = () => {
//     const idx = LETTERS.indexOf(currentLetter);
//     setCurrentLetter(LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]);
//     setHasDrawing(false);
//     setMessage("");
//     setMessageType("");
//   };

//   const msgColor =
//     messageType === "success"
//       ? "#15803d"
//       : messageType === "error"
//       ? "#b91c1c"
//       : "#6366f1";

//   return (
//     <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #eef2ff 0%, #fdf4ff 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
//       <div style={{ width: "100%", maxWidth: 560 }}>

//         {/* Header */}
//         <div style={{ textAlign: "center", marginBottom: 20 }}>
//           <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>✏️ Handwriting Practice</h1>
//           <p style={{ fontSize: 14, color: "#6366f1", margin: "4px 0 0" }}>Trace the letter and tap Check!</p>
//         </div>

//         {/* Score */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16 }}>
//           <div style={{ background: "#fff", borderRadius: 12, padding: "8px 20px", border: "1.5px solid #e0e7ff", textAlign: "center" }}>
//             <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Correct</div>
//             <div style={{ fontSize: 24, fontWeight: 700, color: "#15803d" }}>{score.correct}</div>
//           </div>
//           <div style={{ background: "#fff", borderRadius: 12, padding: "8px 20px", border: "1.5px solid #e0e7ff", textAlign: "center" }}>
//             <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Tried</div>
//             <div style={{ fontSize: 24, fontWeight: 700, color: "#1e1b4b" }}>{score.total}</div>
//           </div>
//         </div>

//         {/* Letter navigation */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
//           <button onClick={prevLetter} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #c7d2fe", background: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4338ca" }}>‹</button>

//           <div style={{ background: "#4338ca", borderRadius: 20, padding: "8px 36px", display: "flex", alignItems: "center", gap: 12 }}>
//             <span style={{ fontSize: 72, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{currentLetter}</span>
//             <span style={{ fontSize: 42, fontWeight: 700, color: "rgba(255,255,255,0.5)", lineHeight: 1 }}>{currentLetter.toLowerCase()}</span>
//           </div>

//           <button onClick={nextLetter} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #c7d2fe", background: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4338ca" }}>›</button>
//         </div>

//         {/* Canvas */}
//         <div style={{ borderRadius: 20, overflow: "hidden", border: "2px solid #c7d2fe", boxShadow: "0 4px 24px rgba(99,102,241,0.10)" }}>
//           <canvas
//             ref={canvasRef}
//             width={canvasSize.width}
//             height={canvasSize.height}
//             style={{ display: "block", width: "100%", touchAction: "none", cursor: "crosshair" }}
//             onMouseDown={startDraw}
//             onMouseMove={draw}
//             onMouseUp={stopDraw}
//             onMouseLeave={stopDraw}
//             onTouchStart={startDraw}
//             onTouchMove={draw}
//             onTouchEnd={stopDraw}
//           />
//         </div>

//         {/* Message */}
//         <div style={{ minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
//           {message && (
//             <div style={{ background: "#fff", border: `2px solid ${msgColor}20`, borderRadius: 12, padding: "10px 24px", fontSize: 18, fontWeight: 700, color: msgColor, textAlign: "center" }}>
//               {message}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
//           <button
//             onClick={clearCanvas}
//             style={{ flex: 1, padding: "14px 0", background: "#fff", color: "#6366f1", border: "2px solid #c7d2fe", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
//           >
//             🗑 Clear
//           </button>
//           <button
//             onClick={checkWithAI}
//             disabled={!hasDrawing || messageType === "checking"}
//             style={{ flex: 2, padding: "14px 0", background: hasDrawing && messageType !== "checking" ? "#4338ca" : "#a5b4fc", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: hasDrawing && messageType !== "checking" ? "pointer" : "default", transition: "background 0.2s" }}
//           >
//             {messageType === "checking" ? "⏳ Checking..." : "✅ Check!"}
//           </button>
//           <button
//             onClick={nextLetter}
//             style={{ flex: 1, padding: "14px 0", background: "#fff", color: "#6366f1", border: "2px solid #c7d2fe", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
//           >
//             Next ›
//           </button>
//         </div>

//         {/* Letter row */}
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginTop: 20 }}>
//           {LETTERS.map((l) => (
//             <button
//               key={l}
//               onClick={() => { setCurrentLetter(l); setHasDrawing(false); setMessage(""); setMessageType(""); }}
//               style={{ width: 32, height: 32, borderRadius: 8, border: l === currentLetter ? "2px solid #4338ca" : "1.5px solid #e0e7ff", background: l === currentLetter ? "#4338ca" : "#fff", color: l === currentLetter ? "#fff" : "#4338ca", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
//             >
//               {l}
//             </button>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Handwriting;