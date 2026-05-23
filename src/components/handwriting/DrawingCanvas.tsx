// ==============================
// 📁 DrawingCanvas.tsx
// ==============================

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Point {
  x: number;
  y: number;
}

interface Props {
  guide: string;
}

const DrawingCanvas = ({ guide }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawing, setDrawing] = useState(false);

  const [paths, setPaths] = useState<Point[][]>([]);
  const [redoStack, setRedoStack] = useState<Point[][]>([]);

  const currentPath = useRef<Point[]>([]);

  // RESPONSIVE CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resize = () => {
      const width =
        window.innerWidth < 768
          ? window.innerWidth - 30
          : 800;

      canvas.width = width;
      canvas.height = 400;

      redraw();
    };

    resize();

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener("resize", resize);
  }, [paths]);

  const getPoint = (e: any): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x:
        (e.touches
          ? e.touches[0].clientX
          : e.clientX) - rect.left,

      y:
        (e.touches
          ? e.touches[0].clientY
          : e.clientY) - rect.top,
    };
  };

  const startDrawing = (e: any) => {
    setDrawing(true);

    currentPath.current = [getPoint(e)];
  };

  const draw = (e: any) => {
    if (!drawing) return;

    const point = getPoint(e);

    currentPath.current.push(point);

    redraw();
  };

  const stopDrawing = () => {
    if (!drawing) return;

    setDrawing(false);

    setPaths((prev) => [
      ...prev,
      currentPath.current,
    ]);

    setRedoStack([]);
  };

  const redraw = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // BACKGROUND GUIDE
    ctx.font = "220px Comic Sans MS";
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.textAlign = "center";

    ctx.fillText(
      guide,
      canvas.width / 2,
      250
    );

    // DRAW SAVED PATHS
    [...paths, currentPath.current].forEach((path) => {
      if (path.length < 2) return;

      ctx.beginPath();

      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }

      ctx.strokeStyle = "#7C3AED";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.stroke();
    });
  };

  useEffect(() => {
    redraw();
  }, [paths, guide]);

  const clearCanvas = () => {
    setPaths([]);
    setRedoStack([]);
  };

  const undo = () => {
    if (!paths.length) return;

    const copy = [...paths];

    const last = copy.pop();

    if (!last) return;

    setRedoStack((r) => [...r, last]);

    setPaths(copy);
  };

  const redo = () => {
    if (!redoStack.length) return;

    const copy = [...redoStack];

    const last = copy.pop();

    if (!last) return;

    setPaths((p) => [...p, last]);

    setRedoStack(copy);
  };

  return (
    <div className="canvas-wrapper">

      <div className="canvas-actions">

        <button onClick={undo}>
          ↩ Undo
        </button>

        <button onClick={redo}>
          ↪ Redo
        </button>

        <button onClick={clearCanvas}>
          🧹 Clear
        </button>

      </div>

      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

    </div>
  );
};

export default DrawingCanvas;