import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce((prev) => !prev);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{ ...styles.emoji, transform: bounce ? "translateY(-10px)" : "translateY(0)" }}>
        🤔
      </div>

      <h1>Oops! Page not found</h1>
      <p>This page ran away like a naughty number 😄</p>

      <button style={styles.btn} onClick={() => navigate("/")}>
        🏠 Go Home
      </button>
    </div>
  );
};

const styles: any = {
  container: {
    textAlign: "center",
    padding: "50px",
  },
  emoji: {
    fontSize: "60px",
    transition: "0.3s",
  },
  btn: {
    marginTop: "20px",
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default NotFound;