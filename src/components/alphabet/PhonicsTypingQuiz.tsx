import React, { useEffect, useState, useContext } from "react";
import { ScoreBoardContext } from "../../components/context/ScoreBoardContext";
import AtoZHeader from './AtoZHeader'

type WordItem = {
    emoji: string;
    word: string;
    hint: string;
};

export const WORDS: WordItem[] = [
    { emoji: "🍎", word: "apple", hint: "A _ P P L E" },
    { emoji: "⚽", word: "ball", hint: "B _ L L" },
    { emoji: "🐱", word: "cat", hint: "C _ T" },
    { emoji: "🐶", word: "dog", hint: "D _ G" },
    { emoji: "🦁", word: "lion", hint: "L _ O N" },
    { emoji: "🐟", word: "fish", hint: "F _ S H" },
    { emoji: "🐘", word: "elephant", hint: "E _ E P H A N T" },
    { emoji: "🦓", word: "zebra", hint: "Z _ B R A" },
    { emoji: "🐸", word: "frog", hint: "F _ O G" },
    { emoji: "🐝", word: "bee", hint: "B _ E" },

    { emoji: "🚗", word: "car", hint: "C _ R" },
    { emoji: "✈️", word: "plane", hint: "P _ A N E" },
    { emoji: "🚲", word: "bike", hint: "B _ K E" },
    { emoji: "🚌", word: "bus", hint: "B _ S" },
    { emoji: "🚂", word: "train", hint: "T _ A I N" },

    { emoji: "🏠", word: "house", hint: "H _ U S E" },
    { emoji: "🏫", word: "school", hint: "S _ H O O L" },
    { emoji: "🏥", word: "hospital", hint: "H _ S P I T A L" },
    { emoji: "🌳", word: "tree", hint: "T _ E E" },
    { emoji: "🌸", word: "flower", hint: "F _ O W E R" },

    { emoji: "🍌", word: "banana", hint: "B _ N A N A" },
    { emoji: "🍇", word: "grape", hint: "G _ A P E" },
    { emoji: "🍊", word: "orange", hint: "O _ A N G E" },
    { emoji: "🍉", word: "watermelon", hint: "W _ T E R M E L O N" },
    { emoji: "🍓", word: "strawberry", hint: "S _ R A W B E R R Y" },

    { emoji: "🐰", word: "rabbit", hint: "R _ B B I T" },
    { emoji: "🐔", word: "chicken", hint: "C _ I C K E N" },
    { emoji: "🐷", word: "pig", hint: "P _ G" },
    { emoji: "🐮", word: "cow", hint: "C _ W" },
    { emoji: "🐑", word: "sheep", hint: "S _ E E P" },

    { emoji: "👕", word: "shirt", hint: "S _ I R T" },
    { emoji: "👖", word: "pants", hint: "P _ N T S" },
    { emoji: "👟", word: "shoes", hint: "S _ O E S" },
    { emoji: "🧢", word: "cap", hint: "C _ P" },
    { emoji: "🧦", word: "socks", hint: "S _ C K S" },

    { emoji: "🍕", word: "pizza", hint: "P _ Z Z A" },
    { emoji: "🍔", word: "burger", hint: "B _ R G E R" },
    { emoji: "🍟", word: "fries", hint: "F _ I E S" },
    { emoji: "🥛", word: "milk", hint: "M _ L K" },
    { emoji: "🍩", word: "donut", hint: "D _ N U T" },

    { emoji: "🌞", word: "sun", hint: "S _ N" },
    { emoji: "🌙", word: "moon", hint: "M _ O N" },
    { emoji: "⭐", word: "star", hint: "S _ A R" },
    { emoji: "☁️", word: "cloud", hint: "C _ O U D" },
    { emoji: "🌧️", word: "rain", hint: "R _ I N" },

    { emoji: "📱", word: "phone", hint: "P _ O N E" },
    { emoji: "💻", word: "laptop", hint: "L _ P T O P" },
    { emoji: "📚", word: "book", hint: "B _ O K" },
    { emoji: "✏️", word: "pencil", hint: "P _ N C I L" },
    { emoji: "🖍️", word: "crayon", hint: "C _ A Y O N" },

    { emoji: "🎈", word: "balloon", hint: "B _ L L O O N" },
    { emoji: "🎁", word: "gift", hint: "G _ F T" },
    { emoji: "🎂", word: "cake", hint: "C _ K E" },
    { emoji: "🎧", word: "music", hint: "M _ S I C" },
    { emoji: "🎮", word: "game", hint: "G _ M E" },

    // extra set (to reach 100+)
    { emoji: "🦋", word: "butterfly", hint: "B _ T T E R F L Y" },
    { emoji: "🐞", word: "ladybug", hint: "L _ D Y B U G" },
    { emoji: "🐍", word: "snake", hint: "S _ A K E" },
    { emoji: "🦒", word: "giraffe", hint: "G _ R A F F E" },
    { emoji: "🐊", word: "crocodile", hint: "C _ O C O D I L E" },

    { emoji: "🍰", word: "cake", hint: "C _ K E" },
    { emoji: "🍪", word: "cookie", hint: "C _ O K I E" },
    { emoji: "🍭", word: "lollipop", hint: "L _ L L I P O P" },
    { emoji: "🧃", word: "juice", hint: "J _ I C E" },
    { emoji: "🥤", word: "soda", hint: "S _ D A" },

    { emoji: "🏀", word: "basketball", hint: "B _ S K E T B A L L" },
    { emoji: "🏈", word: "football", hint: "F _ O O T B A L L" },
    { emoji: "🎾", word: "tennis", hint: "T _ N N I S" },
    { emoji: "🏓", word: "paddle", hint: "P _ D D L E" },
    { emoji: "🥏", word: "frisbee", hint: "F _ I S B E E" },
];

const PhonicsQuiz: React.FC = () => {
    const { updateScore } = useContext(ScoreBoardContext);

    const [questions, setQuestions] = useState<WordItem[]>([]);
    const [index, setIndex] = useState(0);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);

    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [showHint, setShowHint] = useState(false);

    const current = questions[index];

    // ---------------- INIT ----------------
    useEffect(() => {
        const shuffled = [...WORDS]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        setQuestions(shuffled);
    }, []);

    // ---------------- SPEAK ----------------
    const speak = (text: string) => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    };

    useEffect(() => {
        if (current) speak(current.word);
    }, [index, questions]);

    // ---------------- NEXT ----------------
    const next = () => {
        setInput("");
        setStatus("idle");
        setShowHint(false); // reset hint

        if (index + 1 < questions.length) {
            setIndex((i) => i + 1);
        } else {
            updateScore({
                id: 1,
                kidName: "kid",
                alphabetScore: score,
                numbersScore: 0,
                mathScore: 0,
                puzzleScore: 0,
                level: 1,
            });
        }
    };

    // ---------------- AUTO CHECK ----------------
    useEffect(() => {
        if (!current) return;

        const value = input.trim().toLowerCase();
        if (!value) return;

        if (value === current.word.toLowerCase()) {
            setStatus("correct");
            setScore((s) => s + 1);
            speak("Correct");

            setTimeout(() => {
                next();
            }, 1200);
        } else {
            const t = setTimeout(() => {
                setStatus("wrong");
                speak("Wrong answer");
            }, 1000);

            return () => clearTimeout(t);
        }
    }, [input]);

    // ---------------- HINT CLICK ----------------
    const handleHint = () => {
        setShowHint(true);
        speak("Here is your hint");

        // auto hide after 4 sec (important UX fix)
        setTimeout(() => {
            setShowHint(false);
        }, 4000);
    };

    if (!current) return <div>Loading...</div>;

    return (
        <>
            <AtoZHeader />
            <div style={styles.container}>
                <div style={styles.card}>
                    {/* HEADER */}
                    <div style={styles.header}>
                        <div>⭐ Score: {score}</div>
                        <div>📘 {index + 1} / 5</div>
                    </div>

                    {/* TITLE */}
                    <h2 style={styles.title}>🎧 Phonics Quiz</h2>

                    {/* EMOJI */}
                    <div style={styles.emoji}>{current.emoji}</div>

                    {/* INSTRUCTION */}
                    <p style={{ color: '#000' }}>🔊 Listen & Type the Word</p>

                    {/* SPEAK BUTTON */}
                    <button style={styles.btnBlue} onClick={() => speak(current.word)}>
                        🔊 Hear Again
                    </button>

                    {/* HINT BUTTON (FIXED LOGIC) */}
                    <button style={styles.btnHint} onClick={handleHint}>
                        💡 Hint
                    </button>

                    {/* HINT DISPLAY */}
                    {showHint && (
                        <div style={styles.hintBox}>
                            {current.hint}
                        </div>
                    )}

                    {/* INPUT */}
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type answer..."
                        style={{
                            ...styles.input,
                            borderColor:
                                status === "correct"
                                    ? "green"
                                    : status === "wrong"
                                        ? "red"
                                        : "#ccc",
                        }}
                    />

                    {/* FEEDBACK */}
                    {status === "correct" && (
                        <div style={styles.correct}>✅ Correct!</div>
                    )}

                    {status === "wrong" && (
                        <div style={styles.wrong}>❌ Try Again</div>
                    )}
                </div>
            </div>
        </>

    );
};

// ---------------- STYLES ----------------
const styles: any = {
    container: {
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "self-start",
        background: "#FEF9C3",
        fontFamily: '"Comic Sans MS", cursive',
        padding: 20,
    },

    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 30,
        padding: 20,
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold",
    },

    title: {
        margin: "10px 0",
        color: '#000'
    },

    emoji: {
        fontSize: "5rem",
        margin: 'auto',
        marginTop: '40px',
        marginBottom: '40px',
    },

    btnBlue: {
        margin: 5,
        padding: "10px 15px",
        borderRadius: 12,
        border: "none",
        background: "#60A5FA",
        color: "#fff",
    },

    btnHint: {
        margin: 5,
        padding: "10px 15px",
        borderRadius: 12,
        border: "none",
        background: "#FACC15",
        color: "#000",
    },

    hintBox: {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: "1.2rem",
        color: "#A16207",
    },

    input: {
        // width: "100%",
        padding: 15,
        fontSize: "1.5rem",
        borderRadius: 15,
        border: "2px solid #ccc",
        textAlign: "center",
        marginTop: 10,
        outline: "none",
    },

    correct: {
        color: "green",
        fontWeight: "bold",
        marginTop: 10,
    },

    wrong: {
        color: "red",
        fontWeight: "bold",
        marginTop: 10,
    },
};

export default PhonicsQuiz;