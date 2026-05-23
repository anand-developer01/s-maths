// ==============================
// 📁 LetterGuide.tsx
// ==============================

interface Props {
  letter: string;
}

const speak = (text: string) => {
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.8;

  speechSynthesis.speak(utterance);
};

const LetterGuide = ({ letter }: Props) => {
  return (
    <div className="guide-card">

      <div className="guide-top">
        <h2>Trace This Letter 👇</h2>

        <button
          className="speak-btn"
          onClick={() => speak(letter)}
        >
          🔊 Pronounce
        </button>
      </div>

      <div className="guide-letter">
        {letter}
      </div>

    </div>
  );
};

export default LetterGuide;