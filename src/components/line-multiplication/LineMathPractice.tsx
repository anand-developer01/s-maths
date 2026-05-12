import React, { useRef, useEffect, useState } from 'react';

interface Point { x: number; y: number; }
interface Line { start: Point; end: Point; set: 'A' | 'B'; }

const VisualMultiplication: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [activeSet, setActiveSet] = useState<'A' | 'B'>('A');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPt, setStartPt] = useState<Point | null>(null);
  const [calculation, setCalculation] = useState<{ valA: number, valB: number, result: number } | null>(null);

  // Grouping Logic: Detects gaps between lines to identify digits (e.g., 2 lines then a gap then 1 line = 21)
  const calculateDigits = (relevantLines: Line[], axis: 'y' | 'x') => {
    if (relevantLines.length === 0) return 0;
    
    // Sort lines by their position on the canvas
    const sortedPositions = relevantLines
      .map(l => (l.start[axis] + l.end[axis]) / 2)
      .sort((a, b) => a - b);

    const groups: number[] = [];
    let currentGroupCount = 1;
    const GAP_THRESHOLD = 60; // Pixels required to consider it a "new digit"

    for (let i = 1; i < sortedPositions.length; i++) {
      if (sortedPositions[i] - sortedPositions[i - 1] > GAP_THRESHOLD) {
        groups.push(currentGroupCount);
        currentGroupCount = 1;
      } else {
        currentGroupCount++;
      }
    }
    groups.push(currentGroupCount);
    
    // Convert array of digits [2, 1] into the number 21
    return parseInt(groups.join(''), 10);
  };

  const handleCalculate = () => {
    const setALines = lines.filter(l => l.set === 'A'); // Horizontal-ish
    const setBLines = lines.filter(l => l.set === 'B'); // Vertical-ish

    const valA = calculateDigits(setALines, 'y');
    const valB = calculateDigits(setBLines, 'x');

    setCalculation({ valA, valB, result: valA * valB });
  };

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

  useEffect(() => { draw(); }, [lines]);

  const onStart = (e: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setStartPt({ x, y });
    setIsDrawing(true);
    setCalculation(null);
  };

  const onEnd = (e: any) => {
    if (!isDrawing || !startPt) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - (rect?.left || 0);
    const y = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - (rect?.top || 0);

    setLines([...lines, { start: startPt, end: { x, y }, set: activeSet }]);
    setIsDrawing(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h2>Place-Value Line Multiplication</h2>
      <p>Draw horizontal lines for <b>Set A</b> (leave gaps for tens/units). Then draw vertical for <b>Set B</b>.</p>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setActiveSet('A')} style={{...btn, border: activeSet === 'A' ? '3px solid black' : 'none', backgroundColor: '#3b82f6', color: 'white'}}>Set A (Horizontal)</button>
        <button onClick={() => setActiveSet('B')} style={{...btn, border: activeSet === 'B' ? '3px solid black' : 'none', backgroundColor: '#ef4444', color: 'white', marginLeft: '10px'}}>Set B (Vertical)</button>
        <button onClick={() => {setLines([]); setCalculation(null);}} style={{...btn, marginLeft: '20px'}}>Clear</button>
      </div>

      <canvas
        ref={canvasRef}
        width={800} height={450}
        onMouseDown={onStart} onMouseUp={onEnd}
        onTouchStart={onStart} onTouchEnd={onEnd}
        style={{ border: '2px solid #333', borderRadius: '8px', cursor: 'crosshair', touchAction: 'none', backgroundColor: '#fff' }}
      />

      <div style={{ marginTop: '20px' }}>
        {lines.length > 0 && !calculation && (
          <button onClick={handleCalculate} style={{...btn, backgroundColor: '#10b981', color: 'white', padding: '15px 30px', fontSize: '1.2rem'}}>
            Calculate Value
          </button>
        )}

        {calculation && (
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111' }}>
            {calculation.valA} × {calculation.valB} = <span style={{ color: '#10b981' }}>{calculation.result}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const btn = { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const };

export default VisualMultiplication;