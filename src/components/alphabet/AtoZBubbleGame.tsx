import { useEffect, useRef, useState } from "react";
import AtoZHeader from './AtoZHeader'
type Bubble = {
  id: number;
  letter: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number; // for sway offset per bubble
};

const COLORS = [
  "#FEF9C3",
  "#DBEAFE",
  "#F3E8FF",
  "#DCFCE7",
  "#FFE4E6",
  "#E0F2FE",
  "#FDE68A",
  "#C7D2FE",
  "#BBF7D0",
  "#FECACA",
  "#FBCFE8",
  "#DDD6FE",
  "#A7F3D0",
  "#BFDBFE",
  "#FCD34D",
  "#93C5FD",
  "#A5B4FC",
  "#86EFAC",
  "#F9A8D4",
  "#67E8F9",
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TOP_SAFE = 130; // px below topBar — bubbles never go above this
const MARGIN = 8;     // px gap from screen edges

const rnd = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const BubbleGame = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [message, setMessage] = useState("");


  // refs so the animation loop always sees latest values without stale closure
  const bubblesRef = useRef<Bubble[]>([]);
  const targetIndexRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // keep refs in sync with state
  useEffect(() => { bubblesRef.current = bubbles; }, [bubbles]);
  useEffect(() => { targetIndexRef.current = targetIndex; }, [targetIndex]);

  // 🔊 SPEAK
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  // 🎈 CREATE BUBBLES — strict overlap prevention at spawn
  const createBubbles = () => {
    const W = window.innerWidth - 300;
    const H = window.innerHeight;
    const placed: Bubble[] = [];

    LETTERS.forEach((letter, i) => {
      const size = Math.floor(rnd(70, 80));
      const r = size / 2;
      let x = 0;
      let y = 0;
      let ok = false;
      let tries = 0;

      while (!ok && tries < 2000) {
        // keep fully inside screen from the start
        x = rnd(MARGIN, W - size - MARGIN);
        y = rnd(TOP_SAFE, H - size - MARGIN);
        ok = true;

        for (const b of placed) {
          const br = b.size / 2;
          const dist = Math.hypot(
            x + r - (b.x + br),
            y + r - (b.y + br)
          );
          // 20px gap between bubble edges at spawn
          if (dist < r + br + 20) {
            ok = false;
            break;
          }
        }
        tries++;
      }

      placed.push({
        id: i,
        letter,
        x,
        y,
        size,
        color: COLORS[i % COLORS.length],
        speed: rnd(1.5, 2.5),
        phase: rnd(0, Math.PI * 2), // unique sway phase per bubble
      });
    });

    setBubbles(placed);
    bubblesRef.current = placed;
  };

  // 🎮 ANIMATION LOOP — move + collision resolve + boundary clamp every frame
  const startLoop = () => {
    let lastTick = 0;

    const tick = (ts: number) => {
      // throttle to ~12fps (80ms) matching original interval(80)
      if (ts - lastTick < 80) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTick = ts;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const t = ts / 1000;

      const next = bubblesRef.current.map((b) => {
        let nx = b.x + Math.sin(t + b.phase) * 0.4;
        let ny = b.y - b.speed;

        // ✅ recycle bubble — re-enter from bottom at random X
        if (ny + b.size < 0) {
          ny = H + rnd(20, 120);
          nx = rnd(MARGIN, W - b.size - MARGIN);
        }

        // ✅ hard clamp to screen edges every tick — never goes out
        nx = Math.max(MARGIN, Math.min(W - b.size - MARGIN, nx));
        ny = Math.max(TOP_SAFE, Math.min(H - b.size - MARGIN, ny));

        return { ...b, x: nx, y: ny };
      });

      // ✅ collision resolution — push overlapping bubbles apart
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const a = next[i];
          const b = next[j];
          const ar = a.size / 2;
          const br = b.size / 2;
          const dx = (b.x + br) - (a.x + ar);
          const dy = (b.y + br) - (a.y + ar);
          const dist = Math.hypot(dx, dy) || 0.001;
          const minDist = ar + br + 10; // 10px gap between edges

          if (dist < minDist) {
            const overlap = (minDist - dist) / 2;
            const nx2 = dx / dist;
            const ny2 = dy / dist;

            next[i] = {
              ...a,
              x: Math.max(MARGIN, Math.min(W - a.size - MARGIN, a.x - nx2 * overlap)),
              y: Math.max(TOP_SAFE, Math.min(H - a.size - MARGIN, a.y - ny2 * overlap)),
            };
            next[j] = {
              ...b,
              x: Math.max(MARGIN, Math.min(W - b.size - MARGIN, b.x + nx2 * overlap)),
              y: Math.max(TOP_SAFE, Math.min(H - b.size - MARGIN, b.y + ny2 * overlap)),
            };
          }
        }
      }

      bubblesRef.current = next;
      setBubbles([...next]);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  };

  // 🎯 INIT
  useEffect(() => {
    createBubbles();
    startLoop();

    const onResize = () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      createBubbles();
      startLoop();
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 🎯 POP
  const popBubble = (bubble: Bubble) => {
    const expected = LETTERS[targetIndexRef.current];

    if (bubble.letter === expected) {
      // correct — just speak the letter
      speak(bubble.letter);
      setScore((s) => s + 1);
      setMessage("✅ Great Job!");

      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setMessage(""), 1000);

      const next = bubblesRef.current.filter((b) => b.id !== bubble.id);
      bubblesRef.current = next;
      setBubbles(next);

      const newIndex = targetIndexRef.current + 1;
      targetIndexRef.current = newIndex;
      setTargetIndex(newIndex);

      // stop loop when all popped
      if (newIndex >= LETTERS.length) {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      }
    } else {
      // show which wrong letter was tapped and which to find
      setMessage(`❌ That is "${bubble.letter}" — Find "${expected}"`);

      // speak: "Wrong! That is X. Find Y."
      speechSynthesis.cancel();
      const wrongSpeech = new SpeechSynthesisUtterance(
        `Wrong! That is ${bubble.letter}. Find ${expected}.`
      );
      wrongSpeech.rate = 0.9;
      speechSynthesis.speak(wrongSpeech);

      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setMessage(""), 2500);
    }
  };

  const completed = targetIndex >= LETTERS.length;

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: '55px' }}>
        <AtoZHeader />
      </div>
      {/* <div style={styles.title}>
        🎈 A to Z Bubble Pop Game
      </div> */}

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.score}>
          ⭐ Score: {score}
        </div>

        {!completed ? (
          <div style={styles.target}>
            <span style={styles.popUp}> 🎯  Pop Letter </span>
            <span style={styles.targetLetter}>
              {LETTERS[targetIndex]}
            </span>
          </div>
        ) : (
          <div style={styles.complete}>
            🎉 Completed A-Z!
          </div>
        )}
      </div>

      {/* MESSAGE */}
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {/* BUBBLES */}
      {!completed &&
        bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble)}
            style={{
              ...styles.bubble,
              left: bubble.x,
              top: bubble.y + TOP_OFFSET,
              width: bubble.size,
              height: bubble.size,
              background: bubble.color,
            }}
          >
            {bubble.letter}
          </div>
        ))}
    </div>
  );
};

// 🎨 STYLES — unchanged from original
const isMobile = window.innerWidth < 768;
const TOP_OFFSET = isMobile ? 100 : 50;
const styles: any = {
  container: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100vh",
    background: "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    fontFamily: '"Comic Sans MS", cursive',
  },
  popUp: {
    fontHeight: '300px'
  },
  topBar: {
    position: "absolute",
    top: isMobile ? 105 : 60,
    // top:60,
    left: 20,
    right: 20,
    zIndex: 10,

    display: "flex",
    // flexDirection:'column',
    justifyContent: "space-between",
    alignItems: "center",
    // flexWrap: "wrap",
    gap: 12,
  },

  score: {
    background: "#fff",
    fontSize: "1.5rem",
    padding: "12px 18px",
    borderRadius: 20,
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  title: {
    fontSize: "1.5rem",
    // marginBottom: 10,
    color: "#0f172a",
  },

  target: {
    background: "#fff",
    fontSize: "1.5rem",
    padding: "10px",
    borderRadius: 20,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    lineHight: '10px',
    // gap: 10,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  targetLetter: {
    fontSize: "4rem",
    color: "#2563EB",
    fontWeight: "900",
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(181, 137, 224, 0.8)',

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  complete: {
    background: "#22C55E",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 20,
    fontWeight: "bold",
  },

  message: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,

    background: "#fff",
    padding: "14px 24px",
    borderRadius: 20,
    fontSize: "1.2rem",
    fontWeight: "bold",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },

  bubble: {
    position: "absolute",

    borderRadius: "50%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "2rem",
    fontWeight: "900",

    color: "#111827",

    cursor: "pointer",
    userSelect: "none",

    border: "4px solid rgba(255,255,255,0.9)",

    boxShadow:
      "inset -8px -10px 18px rgba(255,255,255,0.55), 0 12px 24px rgba(0,0,0,0.12)",
  },
};

export default BubbleGame;