import React, { useState, useEffect, useCallback } from 'react';

// Configuration for colors and styles
const THEMES = {
  '+': { bg: '#FEF9C3', accent: '#FACC15', text: '#A16207', shadow: '#CA8A04', icon: '➕' },
  '-': { bg: '#DBEAFE', accent: '#60A5FA', text: '#1E40AF', shadow: '#2563EB', icon: '➖' },
  '*': { bg: '#F3E8FF', accent: '#C084FC', text: '#6B21A8', shadow: '#9333EA', icon: '✖️' },
  '/': { bg: '#DCFCE7', accent: '#4ADE80', text: '#166534', shadow: '#16A34A', icon: '➗' },
};

const Asmd = () => {
  const [level, _setLevel] = useState(1);
  const [operation, setOperation] = useState<keyof typeof THEMES>('+');
  const [currentTest, setCurrentTest] = useState(1);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [isShaking, setIsShaking] = useState(false); // For wrong answers

  const theme = THEMES[operation];

  const generateProblem = useCallback(() => {
    const ranges = [{min:1, max:5}, {min:5, max:20}, {min:10, max:100}, {min:50, max:500}];
    const { min, max } = ranges[level - 1];
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;
    
    let finalA = a, finalB = b, finalAns = 0;
    if (operation === '+') finalAns = a + b;
    if (operation === '-') { finalA = Math.max(a, b); finalB = Math.min(a, b); finalAns = finalA - finalB; }
    if (operation === '*') finalAns = a * b;
    if (operation === '/') { finalAns = a; finalA = a * b; finalB = b; }

    setProblem({ a: finalA, b: finalB, answer: finalAns });
  }, [level, operation]);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userInput) === problem.answer) {
      setScore(s => s + 1);
      nextStep();
    } else {
      // Trigger Shake Animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const nextStep = () => {
    if (currentTest < 5) {
      setCurrentTest(t => t + 1);
      setUserInput('');
      generateProblem();
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      transition: 'all 0.5s ease',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive' 
    }}>
      
      {/* Main Card */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '40px',
        boxShadow: `0 20px 0 ${theme.shadow}44, 0 30px 60px rgba(0,0,0,0.1)`,
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
        border: '8px solid white'
      }}>
        
        {/* Header Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ background: '#f0f0f0', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
            Level {level} 🎖️
          </div>
          <div style={{ color: '#22c55e', fontWeight: '900', fontSize: '1.2rem' }}>
            Score: {score} ✨
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {Object.keys(THEMES).map((op) => (
            <button
              key={op}
              onClick={() => { setOperation(op as any); setCurrentTest(1); setScore(0); }}
              style={{
                flex: 1,
                border: 'none',
                padding: '15px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '1.5rem',
                backgroundColor: operation === op ? THEMES[op as keyof typeof THEMES].accent : '#f5f5f5',
                transform: operation === op ? 'scale(1.1) translateY(-5px)' : 'none',
                boxShadow: operation === op ? `0 8px 0 ${THEMES[op as keyof typeof THEMES].shadow}` : 'none',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {THEMES[op as keyof typeof THEMES].icon}
            </button>
          ))}
        </div>

        {!isGameOver ? (
          <div className={isShaking ? 'shake-animation' : ''}>
            <p style={{ color: '#aaa', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Task {currentTest} of 5
            </p>
            
            <div style={{ fontSize: '5rem', fontWeight: '900', margin: '20px 0', color: '#333' }}>
              {problem.a} <span style={{ color: theme.accent }}>{operation}</span> {problem.b}
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="number"
                value={userInput}
                autoFocus
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="?"
                style={{
                  width: '80%',
                  textAlign: 'center',
                  fontSize: '3rem',
                  padding: '20px',
                  borderRadius: '30px',
                  border: `5px solid ${isShaking ? '#ef4444' : theme.bg}`,
                  outline: 'none',
                  backgroundColor: '#f9f9f9',
                  transition: 'border 0.3s'
                }}
              />
              <button 
                type="submit"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '25px',
                  padding: '20px',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: theme.accent,
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: `0 10px 0 ${theme.shadow}`,
                  transition: 'all 0.1s'
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(5px)', e.currentTarget.style.boxShadow = 'none')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'none', e.currentTarget.style.boxShadow = `0 10px 0 ${theme.shadow}`)}
              >
                CHECK! 🚀
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆 Done!</h2>
            <p style={{ fontSize: '1.5rem', color: '#666' }}>You earned {score * 10} points!</p>
            <button 
              onClick={() => { setIsGameOver(false); setScore(0); setCurrentTest(1); }}
              style={{
                marginTop: '30px',
                padding: '15px 40px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#333',
                color: 'white',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Asmd;




// import React, { useState, useEffect, useCallback } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// // Register AG Grid Modules
// ModuleRegistry.registerModules([AllCommunityModule]);

// const THEMES = {
//   '+': { bg: '#FEF9C3', accent: '#FACC15', text: '#A16207', shadow: '#CA8A04', icon: '➕' },
//   '-': { bg: '#DBEAFE', accent: '#60A5FA', text: '#1E40AF', shadow: '#2563EB', icon: '➖' },
//   '*': { bg: '#F3E8FF', accent: '#C084FC', text: '#6B21A8', shadow: '#9333EA', icon: '✖️' },
//   '/': { bg: '#DCFCE7', accent: '#4ADE80', text: '#166534', shadow: '#16A34A', icon: '➗' },
// };

// const Asmd = () => {
//   // Game Logic State
//   const [level, setLevel] = useState(1);
//   const [operation, setOperation] = useState<keyof typeof THEMES>('+');
//   const [currentTest, setCurrentTest] = useState(1);
//   const [score, setScore] = useState(0);
//   const [userInput, setUserInput] = useState('');
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });

//   // GRID STATE: To store history of games
//   const [history, setHistory] = useState<any[]>([]);

//   // AG Grid Column Definitions
//   const columnDefs = [
//     { field: "gameNum", headerName: "#", width: 70 },
//     { field: "op", headerName: "Type", width: 90, cellStyle: { fontWeight: 'bold' } },
//     { field: "level", headerName: "Lvl", width: 80 },
//     { field: "finalScore", headerName: "Result", flex: 1, 
//       cellRenderer: (p: any) => `⭐ ${p.value} / 5` 
//     }
//   ];

//   const generateProblem = useCallback(() => {
//     const ranges = [{min:1, max:5}, {min:5, max:20}, {min:10, max:100}, {min:50, max:500}];
//     const { min, max } = ranges[level - 1];
//     let a = Math.floor(Math.random() * (max - min + 1)) + min;
//     let b = Math.floor(Math.random() * (max - min + 1)) + min;
    
//     let finalA = a, finalB = b, finalAns = 0;
//     if (operation === '+') finalAns = a + b;
//     if (operation === '-') { finalA = Math.max(a, b); finalB = Math.min(a, b); finalAns = finalA - finalB; }
//     if (operation === '*') finalAns = a * b;
//     if (operation === '/') { finalAns = a; finalA = a * b; finalB = b; }

//     setProblem({ a: finalA, b: finalB, answer: finalAns });
//   }, [level, operation]);

//   useEffect(() => { generateProblem(); }, [generateProblem]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const isCorrect = parseInt(userInput) === problem.answer;
//     const newScore = isCorrect ? score + 1 : score;
    
//     if (isCorrect) setScore(newScore);

//     if (currentTest < 5) {
//       setCurrentTest(t => t + 1);
//       setUserInput('');
//       generateProblem();
//     } else {
//       // GAME OVER: Save to Grid History
//       const newEntry = {
//         gameNum: history.length + 1,
//         op: operation,
//         level: level,
//         finalScore: newScore
//       };
//       setHistory([newEntry, ...history]); // Add to top of grid
//       setIsGameOver(true);
//     }
//   };

//   const theme = THEMES[operation];

//   return (
//     <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '40px' }}>
//       <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
//         {/* LEFT SIDE: The Game Card */}
//         <div style={{ background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
//           {!isGameOver ? (
//             <div>
//               <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
//                 {Object.keys(THEMES).map(op => (
//                   <button key={op} onClick={() => setOperation(op as any)} style={{ flex: 1, border: 'none', background: operation === op ? THEMES[op as keyof typeof THEMES].accent : '#eee', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
//                     {THEMES[op as keyof typeof THEMES].icon}
//                   </button>
//                 ))}
//               </div>
//               <h2 style={{ fontSize: '4rem', margin: '20px 0' }}>{problem.a} {operation} {problem.b}</h2>
//               <form onSubmit={handleSubmit}>
//                 <input 
//                   type="number" 
//                   value={userInput} 
//                   onChange={e => setUserInput(e.target.value)} 
//                   style={{ fontSize: '2rem', textAlign: 'center', padding: '15px', borderRadius: '15px', border: `3px solid ${theme.accent}` }}
//                   autoFocus 
//                 />
//                 <button type="submit" style={{ width: '100%', marginTop: '15px', padding: '15px', borderRadius: '15px', border: 'none', background: theme.accent, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>CHECK</button>
//               </form>
//             </div>
//           ) : (
//             <div style={{ textAlign: 'center' }}>
//               <h2 style={{ fontSize: '2.5rem' }}>Final: {score}/5</h2>
//               <button onClick={() => {setIsGameOver(false); setScore(0); setCurrentTest(1); setUserInput('');}} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#333', color: 'white', cursor: 'pointer' }}>Try Again</button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT SIDE: The Table Grid (Scoreboard) */}
//         <div style={{ background: 'white', padding: '20px', borderRadius: '30px', display: 'flex', flexDirection: 'column' }}>
//           <h3 style={{ margin: '0 0 15px 0', color: '#666' }}>🏆 Scoreboard History</h3>
//           <div className="ag-theme-quartz" style={{ height: '350px', width: '100%' }}>
//             <AgGridReact
//               rowData={history}
//               columnDefs={columnDefs}
//               defaultColDef={{ resizable: true }}
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Asmd;