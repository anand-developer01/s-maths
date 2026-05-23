import { useNavigate } from "react-router-dom";
import  { ScoreBoardContext } from '../components/context/ScoreBoardContext'
import { useContext } from "react";
const CARDS = [
  {
    title: "🔤 Alphabet",
    desc: "A to Z Learning",
    path: "/alphabet",
    color: "#FDE68A",
  },
  {
    title: "🔢 Numbers",
    desc: "0 to 100 Learning",
    path: "/number-learning",
    color: "#DBEAFE",
  },
  {
    title: "🎨 Colors",
    desc: "Learn Colors",
    path: "/colors",
    color: "#F3E8FF",
  },
  {
    title: "✖️ Math Game",
    desc: "ASMD Practice",
    path: "/asmd-game",
    color: "#DCFCE7",
  },
  {
    title: "🧠 Quiz",
    desc: "Test Your Brain",
    path: "/quiz",
    color: "#FFE4E6",
  },
  {
    title: "🧩 Puzzle",
    desc: "Fun Logic Game",
    path: "/puzzle",
    color: "#E0F2FE",
  },
  {
    title: "📊 Line Math",
    desc: "Visual Multiplication",
    path: "/line-multiplication",
    color: "#C7D2FE",
  },
];

const SCORES = [
  { label: "Alphabet Mastery", score: 85, color: "#22C55E" },
  { label: "Numbers", score: 70, color: "#3B82F6" },
  { label: "Math Quiz", score: 60, color: "#A855F7" },
  { label: "Puzzle Skills", score: 40, color: "#F97316" },
];

const Home = () => {
  const navigate = useNavigate();
const { kidData }  = useContext(ScoreBoardContext)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎓 Kids Learning Dashboard</h1>
      <p style={styles.subtitle}>Fun learning starts here 🚀</p>

      {/* SCORE BOARD */}
      <div style={styles.scoreBoard}>
        <h2 style={styles.sectionTitle}>🏆 Score Board</h2>

        <div style={styles.scoreGrid}>
          {SCORES.map((s, i) => (
            <div key={i} style={{ ...styles.scoreCard, borderColor: s.color }}>
              <div style={styles.scoreLabel}>{s.label}</div>
              <div style={{ ...styles.scoreValue, color: s.color }}>
                {s.score}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEARNING CARDS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📚 Learning & Games</h2>

        <div style={styles.grid}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              style={{
                ...styles.card,
                background: card.color,
              }}
            >
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardDesc}>{card.desc}</div>

              <div style={styles.arrow}>➜</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER BANNER */}
      <div>
        { JSON.stringify(kidData) }
      </div>
      <div style={styles.footer}>
        🌟 Keep Learning Every Day 🌟
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: '"Comic Sans MS", cursive',
    background: "linear-gradient(135deg, #f0f9ff, #fefce8)",
  },

  title: {
    textAlign: "center",
    fontSize: "2.8rem",
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: "1.6rem",
    marginBottom: 15,
    color: "#111827",
  },

  scoreBoard: {
    background: "#fff",
    padding: 20,
    borderRadius: 25,
    boxShadow: "0 8px 0 rgba(0,0,0,0.08)",
    marginBottom: 20,
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 15,
  },

  scoreCard: {
    background: "#f9fafb",
    border: "3px solid",
    borderRadius: 20,
    padding: 15,
    textAlign: "center",
  },

  scoreLabel: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },

  scoreValue: {
    fontSize: "1.8rem",
    fontWeight: "900",
    marginTop: 5,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 15,
  },

  card: {
    height: 120,
    borderRadius: 20,
    padding: 15,
    cursor: "pointer",
    position: "relative",
    boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
    transition: "all 0.2s ease",
  },

  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "900",
  },

  cardDesc: {
    fontSize: "0.85rem",
    marginTop: 5,
    color: "#374151",
  },

  arrow: {
    position: "absolute",
    right: 12,
    bottom: 10,
    fontSize: "1.5rem",
  },

  footer: {
    marginTop: 40,
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#6366F1",
  },
};

export default Home;