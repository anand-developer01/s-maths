import React, { useRef, useEffect, useState } from 'react';

interface Point { x: number; y: number; }
interface Line { start: Point; end: Point; set: 'A' | 'B'; }

const VisualMultiplication: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [history, setHistory] = useState<Line[][]>([]);
  const [redoStack, setRedoStack] = useState<Line[][]>([]);

  const [activeSet, setActiveSet] = useState<'A' | 'B'>('A');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPt, setStartPt] = useState<Point | null>(null);

  const [calculation, setCalculation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 450 });

  // RESPONSIVE CANVAS
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 600) setCanvasSize({ w: w - 20, h: 300 });
      else if (w < 1024) setCanvasSize({ w: 600, h: 380 });
      else setCanvasSize({ w: 800, h: 450 });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // UNDO / REDO
  const pushHistory = (newLines: Line[]) => {
    setHistory(prev => [...prev, lines]);
    setLines(newLines);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];

    setRedoStack(r => [...r, lines]);
    setLines(prev);
    setHistory(h => h.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];

    setHistory(h => [...h, lines]);
    setLines(next);
    setRedoStack(r => r.slice(0, -1));
  };

  // 🔥 INTERSECTION DETECTION (REAL CROSS POINTS)
  const getIntersection = (a: Line, b: Line) => {
    const x1 = a.start.x, y1 = a.start.y;
    const x2 = a.end.x, y2 = a.end.y;
    const x3 = b.start.x, y3 = b.start.y;
    const x4 = b.end.x, y4 = b.end.y;

    const denom =
      (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denom === 0) return null;

    const t =
      ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

    const u =
      -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
      };
    }

    return null;
  };

  // YOUR ORIGINAL LOGIC (UNCHANGED)
  const calculateDigits = (relevantLines: Line[], axis: 'y' | 'x') => {
    if (relevantLines.length === 0) return 0;

    const sorted = relevantLines
      .map(l => (l.start[axis] + l.end[axis]) / 2)
      .sort((a, b) => a - b);

    const groups: number[] = [];
    let count = 1;
    const GAP = 60;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] > GAP) {
        groups.push(count);
        count = 1;
      } else count++;
    }
    groups.push(count);

    return parseInt(groups.join(''), 10);
  };

  // 🚨 MAIN CALCULATION WITH ERROR CHECK
  const handleCalculate = () => {
    const A = lines.filter(l => l.set === 'A');
    const B = lines.filter(l => l.set === 'B');

    let intersections: any[] = [];

    for (let a of A) {
      for (let b of B) {
        const point = getIntersection(a, b);
        if (point) intersections.push(point);
      }
    }

    if (intersections.length === 0) {
      setError("⚠️ No crossing points detected! Draw intersecting lines.");
      setCalculation(null);
      return;
    }

    setError(null);

    const valA = calculateDigits(A, 'y');
    const valB = calculateDigits(B, 'x');

    setCalculation({
      valA,
      valB,
      result: valA * valB,
      intersectionsCount: intersections.length
    });
  };

  // DRAW
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(l => {
      ctx.beginPath();
      ctx.moveTo(l.start.x, l.start.y);
      ctx.lineTo(l.end.x, l.end.y);

      ctx.strokeStyle = l.set === 'A' ? '#3b82f6' : '#ef4444';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  };

  useEffect(() => { draw(); }, [lines, canvasSize]);

  const getPos = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect!.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect!.top;
    return { x, y };
  };

  const onStart = (e: any) => {
    setStartPt(getPos(e));
    setIsDrawing(true);
    setCalculation(null);
  };

  const onEnd = (e: any) => {
    if (!isDrawing || !startPt) return;

    const end = getPos(e);
    const newLines = [...lines, { start: startPt, end, set: activeSet }];

    pushHistory(newLines);
    setIsDrawing(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧮 Visual Multiplication</h2>

      <p>
        Draw horizontal lines for <b>Set A</b> (leave gaps for tens/units). Then draw vertical for <b>Set B</b>.
      </p>

      {/* ERROR */}
      {error && <div style={styles.error}>{error}</div>}

      {/* BUTTONS */}
      <div style={styles.row}>
        <button onClick={() => setActiveSet('A')} style={styles.blueBtn}>Set A</button>
        <button onClick={() => setActiveSet('B')} style={styles.redBtn}>Set B</button>

        <button onClick={undo} style={styles.grayBtn}>Undo</button>
        <button onClick={redo} style={styles.grayBtn}>Redo</button>

        <button onClick={() => setLines([])} style={styles.clearBtn}>Clear</button>
      </div>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        onMouseDown={onStart}
        onMouseUp={onEnd}
        onTouchStart={onStart}
        onTouchEnd={onEnd}
        style={styles.canvas}
      />

      {/* RESULT */}
      <div style={{ marginTop: 20 }}>
        {lines.length > 0 && !calculation && (
          <button onClick={handleCalculate} style={styles.calcBtn}>
            Calculate
          </button>
        )}

        {calculation && (
          <div style={styles.result}>
            {calculation.valA} × {calculation.valB} ={" "}
            <span style={{ color: '#16a34a' }}>
              {calculation.result}
            </span>

            <div style={{ fontSize: 14, marginTop: 5 }}>
              Cross points: {calculation.intersectionsCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Arial',
    background: '#f8fafc',
    minHeight: '100vh',
  },
  title: {
    color: '#0f172a',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  blueBtn: {
    padding: '10px 15px',
    background: '#DBEAFE',
    color: '#1E3A8A',
    borderRadius: 12,
    border: '2px solid #3B82F6',
    fontWeight: 'bold',
  },
  redBtn: {
    padding: '10px 15px',
    background: '#FECACA',
    color: '#7F1D1D',
    borderRadius: 12,
    border: '2px solid #EF4444',
    fontWeight: 'bold',
  },
  grayBtn: {
    padding: '10px 15px',
    background: '#6b7280',
    color: '#fff',
    borderRadius: 10,
    border: 'none',
  },
  clearBtn: {
    padding: '10px 15px',
    background: '#111827',
    color: '#fff',
    borderRadius: 10,
    border: 'none',
  },
  canvas: {
    border: '4px solid #111827',
    borderRadius: 16,
    background: '#fff',
    touchAction: 'none',
    width: '100%',
    maxWidth: 800,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  },
  calcBtn: {
    padding: '15px 25px',
    background: '#10b981',
    color: '#fff',
    borderRadius: 10,
    border: 'none',
    fontSize: 18,
  },
  result: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
};

export default VisualMultiplication;