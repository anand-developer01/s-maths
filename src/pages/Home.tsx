import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1>🎉 Welcome to MathKids</h1>

      <p>Learn multiplication using fun line methods!</p>

      <button
        style={styles.startBtn}
        onClick={() => navigate("/learn")}
      >
        🚀 Start Learning
      </button>

      <div style={styles.card}>
        <h3>Mini Game 🎮</h3>
        <p>Click to earn stars</p>

        <button
          style={styles.starBtn}
          onClick={() => setCount(count + 1)}
        >
          ⭐ Earn Star
        </button>

        <p>Total Stars: {count}</p>
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    textAlign: "center",
    padding: "30px",
  },
  startBtn: {
    padding: "12px 20px",
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  card: {
    marginTop: "40px",
    padding: "20px",
    border: "2px dashed #ccc",
    borderRadius: "12px",
    display: "inline-block",
  },
  starBtn: {
    padding: "10px 15px",
    background: "#facc15",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Home;