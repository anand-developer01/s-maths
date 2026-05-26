import React, { useRef, useState, useEffect } from "react";
import DrawingHeader from "./DrawingHeader";

type Point = { x: number; y: number };

type Task = {
  type: "horizontal" | "vertical" | "diagonal";
  label: string;
};

const TASKS: Task[] = [
  { type: "horizontal", label: "😴 Draw Sleeping Line" },
  { type: "vertical", label: "🚶 Draw Standing Line" },
  { type: "diagonal", label: "🧗 Draw Slanting Line" },
];

const speak = (text: string) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
};

const LineLearningGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [message, setMessage] = useState("");

  const task = TASKS[taskIndex];

  useEffect(() => {
    speak(task.label);
  }, [taskIndex]);

  const getPos = (e: any): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const clientX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const start = (e: any) => {
    const pos = getPos(e);
    setPoints([pos]);
    setDrawing(true);
  };

  const move = (e: any) => {
    if (!drawing) return;

    const pos = getPos(e);
    setPoints((prev) => [...prev, pos]);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const prevPoint = points[points.length - 1];

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const end = () => {
    setDrawing(false);
    checkLine();
  };

  const checkLine = () => {
    if (points.length < 10) {
      setMessage("❌ Try Again!");
      speak("Try again");
      return;
    }

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const dx = maxX - minX;
    const dy = maxY - minY;

    let result = false;

    // 🧠 SIMPLE SHAPE LOGIC (KIDS LEVEL)
    if (task.type === "horizontal") {
      result = dx > dy * 2;
    }

    if (task.type === "vertical") {
      result = dy > dx * 2;
    }

    if (task.type === "diagonal") {
      result = Math.abs(dx - dy) < 80;
    }

    if (result) {
      setMessage("✅ Good Job!");
      speak("Good job");

      setTimeout(() => nextTask(), 1000);
    } else {
      setMessage("❌ Not correct, try again");
      speak("Try again");
    }
  };

  const nextTask = () => {
    setPoints([]);
    setMessage("");
    setTaskIndex((i) => (i + 1) % TASKS.length);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={styles.container}>
        <DrawingHeader/>
      <h1 style={styles.title}>✏️ Line Learning Game</h1>

      <div style={styles.taskBox}>{task.label}</div>

      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={styles.canvas}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />

      {message && <div style={styles.message}>{message}</div>}

      <button onClick={nextTask} style={styles.btn}>
        Next ➡️
      </button>

      <button onClick={clearCanvas} style={styles.clearBtn}>
        Clear 🧹
      </button>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    fontFamily: '"Comic Sans MS", cursive',
  },

  title: {
    fontSize: "2rem",
    marginBottom: 10,
  },

  taskBox: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: 10,
    background: "#fff",
    padding: "10px 20px",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  canvas: {
    background: "#fff",
    border: "3px solid #93C5FD",
    borderRadius: 20,
    touchAction: "none",
    width: '100%',
  },

  message: {
    marginTop: 15,
    fontSize: "1.3rem",
    fontWeight: "bold",
  },

  btn: {
    marginTop: 15,
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    background: "#22C55E",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  clearBtn: {
    marginTop: 10,
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    background: "#EF4444",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default LineLearningGame;