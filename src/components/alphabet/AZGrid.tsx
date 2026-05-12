import { useState } from "react";

const COLORS = [
    "#FEF9C3", "#DBEAFE", "#F3E8FF", "#DCFCE7",
    "#FFE4E6", "#E0F2FE", "#FDE68A", "#C7D2FE",
    "#BBF7D0", "#FECACA", "#FBCFE8", "#DDD6FE",
    "#A7F3D0", "#BFDBFE", "#FDE68A", "#FCD34D",
    "#93C5FD", "#A5B4FC", "#86EFAC", "#F9A8D4",
    "#FDE047", "#67E8F9", "#C4B5FD", "#FDBA74",
    "#34D399", "#60A5FA"
];

const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
);

// 🔊 speech
const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
};

const AZGrid = () => {
    const [isUpperCase, setIsUpperCase] = useState(true);
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    const displayLetters = letters.map((l) =>
        isUpperCase ? l : l.toLowerCase()
    );

    const handleClick = (letter: string) => {
        speak(letter);
        setActiveLetter(letter);

        setTimeout(() => setActiveLetter(null), 3000);
    };

    const getColor = (letter: string) => {
        const index = letter.toUpperCase().charCodeAt(0) - 65;
        return COLORS[index % COLORS.length];
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🔤 A to Z Learning Board</h1>

            <p style={styles.subtitle}>
                Click any letter to hear pronunciation 🎧
            </p>

            <button
                onClick={() => setIsUpperCase((p) => !p)}
                style={styles.toggleBtn}
            >
                {isUpperCase ? "Switch to lowercase 🔡" : "Switch to uppercase 🔠"}
            </button>

            {/* GRID */}
            <div style={styles.grid}>
                {displayLetters.map((letter, i) => (
                    <div
                        key={i}
                        onClick={() => handleClick(letter)}
                        style={{
                            ...styles.card,
                            background: COLORS[i],
                            color: "#000",
                        }}
                    >
                        {letter}
                    </div>
                ))}
            </div>

            {/* FLIP CARD */}
            {activeLetter && (
                <div style={styles.overlay}>
                    <div style={styles.flipCard}>
                        <div style={styles.flipInner}>

                            {/* FRONT */}
                            <div
                                style={{
                                    ...styles.front,
                                    background: getColor(activeLetter),
                                    color: "#fff",
                                }}
                            >
                                {activeLetter}
                            </div>

                            {/* BACK */}
                            <div
                                style={{
                                    ...styles.back,
                                    background: `linear-gradient(135deg, ${getColor(activeLetter)}, #ffffff)`,
                                    color: "#111",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 120,
                                        fontWeight: "900",
                                        color: "#111",
                                        textShadow: "2px 2px 0 rgba(0,0,0,0.15)",
                                    }}
                                >
                                    {activeLetter}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* animation */}
            <style>{`
        @keyframes slowFlip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
        </div>
    );
};

const styles: any = {
    container: {
        minHeight: "100vh",
        padding: 20,
        textAlign: "center",
        fontFamily: '"Comic Sans MS", cursive',
        background: "linear-gradient(135deg, #f0f9ff, #fefce8)",
    },

    title: {
        fontSize: "2.5rem",
        marginBottom: 10,
        color: "#0f172a",
    },

    subtitle: {
        color: "#64748b",
        marginBottom: 15,
    },

    toggleBtn: {
        padding: "10px 18px",
        borderRadius: 20,
        border: "none",
        background: "#111827",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: 25,
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
        gap: 12,
        maxWidth: 800,
        margin: "0 auto",
    },

    card: {
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.8rem",
        fontWeight: "bold",
        borderRadius: 18,
        cursor: "pointer",
        boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
        transition: "all 0.2s ease",
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    flipCard: {
        width: 220,
        height: 220,
        perspective: 1000,
    },

    flipInner: {
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        animation: "slowFlip 1.8s ease-in-out",
    },

    front: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 100,
        fontWeight: "900",
        fontFamily: "'Baloo 2', cursive",
        textShadow: "3px 3px 0 rgba(0,0,0,0.15)",
    },

    back: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Baloo 2', cursive",
    },

    bigLetter: {
        fontSize: 110,
        fontWeight: "900",
        color: "#111",
        textShadow: "2px 2px 0 rgba(0,0,0,0.1)",
    },
};

export default AZGrid;