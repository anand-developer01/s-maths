import { useState, useEffect, useContext, useRef } from "react";
import { ScoreBoardContext } from "../../components/context/ScoreBoardContext";
import AtoZHeader from './AtoZHeader'

const THEMES = [
    { bg: "#FEF9C3", accent: "#FACC15", text: "#A16207", shadow: "#CA8A04" },
    { bg: "#DBEAFE", accent: "#60A5FA", text: "#1E40AF", shadow: "#2563EB" },
    { bg: "#F3E8FF", accent: "#C084FC", text: "#6B21A8", shadow: "#9333EA" },
    { bg: "#DCFCE7", accent: "#4ADE80", text: "#166534", shadow: "#16A34A" },
];

const PHONICS = [
    { letter: "A", answer: "Apple 🍎", options: ["Apple 🍎", "Ball ⚽", "Cat 🐱", "Dog 🐶"] },
    { letter: "B", answer: "Ball ⚽", options: ["Apple 🍎", "Ball ⚽", "Fish 🐟", "Egg 🥚"] },
    { letter: "C", answer: "Cat 🐱", options: ["Cat 🐱", "Dog 🐶", "Hat 🎩", "Ice Cream 🍦"] },
    { letter: "D", answer: "Dog 🐶", options: ["Dog 🐶", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "E", answer: "Elephant 🐘", options: ["Elephant 🐘", "Fish 🐟", "Goat 🐐", "Hat 🎩"] },
    { letter: "F", answer: "Fish 🐟", options: ["Fish 🐟", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "G", answer: "Goat 🐐", options: ["Goat 🐐", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "H", answer: "Hat 🎩", options: ["Hat 🎩", "Apple 🍎", "Cat 🐱", "Dog 🐶"] },
    { letter: "I", answer: "Ice Cream 🍦", options: ["Ice Cream 🍦", "Ball ⚽", "Cat 🐱", "Dog 🐶"] },
    { letter: "J", answer: "Juice 🧃", options: ["Juice 🧃", "Apple 🍎", "Fish 🐟", "Hat 🎩"] },
    { letter: "K", answer: "Kite 🪁", options: ["Kite 🪁", "Ball ⚽", "Dog 🐶", "Fish 🐟"] },
    { letter: "L", answer: "Lion 🦁", options: ["Lion 🦁", "Apple 🍎", "Hat 🎩", "Dog 🐶"] },
    { letter: "M", answer: "Monkey 🐵", options: ["Monkey 🐵", "Cat 🐱", "Fish 🐟", "Ball ⚽"] },
    { letter: "N", answer: "Nest 🪺", options: ["Nest 🪺", "Lion 🦁", "Dog 🐶", "Hat 🎩"] },
    { letter: "O", answer: "Orange 🍊", options: ["Orange 🍊", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "P", answer: "Parrot 🦜", options: ["Parrot 🦜", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "Q", answer: "Queen 👑", options: ["Queen 👑", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "R", answer: "Rabbit 🐰", options: ["Rabbit 🐰", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "S", answer: "Sun ☀️", options: ["Sun ☀️", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "T", answer: "Tiger 🐯", options: ["Tiger 🐯", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "U", answer: "Umbrella ☂️", options: ["Umbrella ☂️", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "V", answer: "Van 🚐", options: ["Van 🚐", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "W", answer: "Watch ⌚", options: ["Watch ⌚", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "X", answer: "Xylophone 🎵", options: ["Xylophone 🎵", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
    { letter: "Y", answer: "Yak 🦬", options: ["Yak 🦬", "Apple 🍎", "Ball ⚽", "Cat 🐱"] },
    { letter: "Z", answer: "Zebra 🦓", options: ["Zebra 🦓", "Dog 🐶", "Fish 🐟", "Hat 🎩"] },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Splits "Apple 🍎" → { label: "Apple", emoji: "🍎" }
const splitOption = (text: string): { label: string; emoji: string } => {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})+/u;
    const match = text.match(emojiRegex);
    if (match) {
        return { emoji: match[0], label: text.replace(match[0], "").trim() };
    }
    return { label: text, emoji: "" };
};

// Strips emoji so TTS only reads the word
const stripEmoji = (text: string): string =>
    text.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})+/gu, "").trim();

const speak = (letter: string, answer: string) => {
    const utterance = new SpeechSynthesisUtterance(
        `${letter} for ${stripEmoji(answer)}`
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
};

const AlphabetPhonicsQuiz = () => {
    const { updateScore } = useContext(ScoreBoardContext);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState<typeof PHONICS>([]);
    // FIX 1: Shuffle options once per game, stored in state — not re-shuffled on every render
    const [shuffledOptions, setShuffledOptions] = useState<string[][]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // FIX 1: Ref to track which question index speech was last triggered for,
    // preventing the effect from speaking twice on the same question.
    const spokenIndexRef = useRef<number>(-1);

    const theme = THEMES[questionIndex % THEMES.length];
    const current = questions[questionIndex];

    const initGame = () => {
        const selected = shuffle(PHONICS).slice(0, 5);
        setQuestions(selected);
        // Pre-shuffle all option arrays once so JSX never re-shuffles them
        setShuffledOptions(selected.map((q) => shuffle(q.options)));
        setQuestionIndex(0);
        setScore(0);
        setIsGameOver(false);
        setIsShaking(false);
        spokenIndexRef.current = -1;
    };

    useEffect(() => {
        initGame();
    }, []);

    // FIX 1: Guard with spokenIndexRef so speech fires exactly once per question
    useEffect(() => {
        if (!current) return;
        if (spokenIndexRef.current === questionIndex) return;
        spokenIndexRef.current = questionIndex;
        speak(current.letter, current.answer);
    }, [questionIndex, current]);

    const handleAnswer = (answer: string) => {
        if (!current) return;

        if (answer === current.answer) {
            const newScore = score + 1;
            setScore(newScore);

            if (questionIndex < 4) {
                setTimeout(() => setQuestionIndex((p) => p + 1), 500);
            } else {
                updateScore({
                    id: 1,
                    kidName: "srihas",
                    alphabetScore: newScore,
                    numbersScore: 0,
                    mathScore: 0,
                    puzzleScore: 0,
                    level: 1,
                });
                setTimeout(() => setIsGameOver(true), 500);
            }
        } else {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    const replayAudio = () => {
        if (!current) return;
        speak(current.letter, current.answer);
    };

    if (!questions.length) return null;

    return (
        <>
            <AtoZHeader />
            <div
                style={{
                    minHeight: "100vh",
                    background: theme.bg,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    fontFamily: '"Comic Sans MS", cursive',
                    transition: "background 0.4s",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 500,
                        background: "#fff",
                        borderRadius: 40,
                        padding: 30,
                        boxShadow: `0 20px 0 ${theme.shadow}55`,
                        textAlign: "center",
                    }}
                >
                    {!isGameOver ? (
                        <div className={isShaking ? "shake" : ""}>
                            {/* Top bar */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        background: "#f1f5f9",
                                        padding: "8px 15px",
                                        borderRadius: 20,
                                        fontWeight: "bold",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    Question {questionIndex + 1}/5
                                </div>
                                <div style={{ color: "#16a34a", fontWeight: 900, fontSize: "1.1rem" }}>
                                    ⭐ {score}
                                </div>
                            </div>

                            {/* Big letter */}
                            <div
                                style={{
                                    fontSize: "7rem",
                                    fontWeight: 900,
                                    color: theme.accent,
                                    lineHeight: 1,
                                    marginBottom: 10,
                                }}
                            >
                                {current.letter}
                            </div>

                            {/* Question text */}
                            <h2 style={{ color: theme.text, marginBottom: 25, fontSize: "1.25rem" }}>
                                Which word starts with <strong>{current.letter}</strong>?
                            </h2>

                            {/* Hear Again button */}
                            <button
                                onClick={replayAudio}
                                style={{
                                    border: "none",
                                    background: theme.accent,
                                    color: "#fff",
                                    padding: "10px 22px",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    marginBottom: 22,
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    fontFamily: "inherit",
                                    display: "inline-block",
                                }}
                            >
                                🔊 Hear Again
                            </button>

                            {/* FIX 2 & 3: Options grid — centered layout, emoji and label split for large emoji */}
                            <div style={{ display: "grid", gap: 12 }}>
                                {/* FIX 1: Use pre-shuffled options from state, not shuffled inline */}
                                {(shuffledOptions[questionIndex] ?? []).map((option) => {
                                    const { label, emoji } = splitOption(option);
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            style={{
                                                border: "none",
                                                padding: "14px 18px",
                                                borderRadius: 20,
                                                background: "#f8fafc",
                                                cursor: "pointer",
                                                boxShadow: "0 5px 0 #cbd5e1",
                                                fontFamily: "inherit",
                                                fontWeight: "bold",
                                                // FIX 2: flex layout so emoji + label are properly aligned
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: '#000',
                                                gap: 10,
                                            }}
                                        >
                                            {/* FIX 3: Emoji rendered at 2rem so it's clearly visible */}
                                            <span style={{ fontSize: "2rem", lineHeight: 1 }}>{emoji}</span>
                                            <span style={{ fontSize: "1.15rem" }}>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        // Game over screen
                        <div>
                            <div style={{ fontSize: "3.5rem" }}>🏆</div>
                            <h1 style={{ color: theme.text, marginBottom: 8 }}>Great Job!</h1>
                            <h2 style={{ marginBottom: 8 }}>Score: {score}/5</h2>
                            <p
                                style={{
                                    fontSize: "1.5rem",
                                    color: "#16a34a",
                                    fontWeight: "bold",
                                    marginBottom: 20,
                                }}
                            >
                                ⭐ {score * 10} Points Earned
                            </p>
                            <button
                                onClick={initGame}
                                style={{
                                    border: "none",
                                    padding: "16px 35px",
                                    borderRadius: 25,
                                    background: theme.accent,
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                Play Again 🎉
                            </button>
                        </div>
                    )}
                </div>

                <style>{`
        @keyframes shake {
          0%   { transform: translateX(0px); }
          25%  { transform: translateX(-10px); }
          50%  { transform: translateX(10px); }
          75%  { transform: translateX(-10px); }
          100% { transform: translateX(0px); }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
            </div>
        </>

    );
};

export default AlphabetPhonicsQuiz;