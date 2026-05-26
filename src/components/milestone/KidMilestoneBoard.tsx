import { useMemo } from "react";

type Milestone = {
  id: number;
  title: string;
  icon: string;
  current: number;
  target: number;
  color: string;
};

const KidMilestoneBoard = () => {
  // Replace with your ScoreBoardContext values
  const scores = {
    alphabetScore: 45,
    phonicsScore: 32,
    numbersScore: 28,
    mathScore: 70,
    drawingScore: 8,
    puzzleScore: 14,
  };

  const totalScore =
    scores.alphabetScore +
    scores.phonicsScore +
    scores.numbersScore +
    scores.mathScore +
    scores.drawingScore +
    scores.puzzleScore;

  const milestones: Milestone[] = useMemo(
    () => [
      {
        id: 1,
        title: "Alphabet Explorer",
        icon: "🔤",
        current: scores.alphabetScore,
        target: 50,
        color: "#60A5FA",
      },
      {
        id: 2,
        title: "Phonics Star",
        icon: "🔊",
        current: scores.phonicsScore,
        target: 50,
        color: "#C084FC",
      },
      {
        id: 3,
        title: "Number Master",
        icon: "🔢",
        current: scores.numbersScore,
        target: 50,
        color: "#4ADE80",
      },
      {
        id: 4,
        title: "Math Hero",
        icon: "➕",
        current: scores.mathScore,
        target: 100,
        color: "#FACC15",
      },
      {
        id: 5,
        title: "Drawing Artist",
        icon: "🎨",
        current: scores.drawingScore,
        target: 10,
        color: "#FB7185",
      },
      {
        id: 6,
        title: "Puzzle Genius",
        icon: "🧩",
        current: scores.puzzleScore,
        target: 20,
        color: "#22D3EE",
      },
      {
        id: 7,
        title: "Learning Champion",
        icon: "🏆",
        current: totalScore,
        target: 300,
        color: "#F59E0B",
      },
    ],
    [scores, totalScore]
  );

  const completedMilestones = milestones.filter(
    (m) => m.current >= m.target
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.trophy}>🏆</div>

          <div>
            <h1 style={styles.title}>
              My Learning Journey
            </h1>

            <p style={styles.subtitle}>
              Keep learning and unlock badges!
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryEmoji}>⭐</div>
            <div style={styles.summaryNumber}>
              {totalScore}
            </div>
            <div style={styles.summaryText}>
              Total Points
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryEmoji}>🏅</div>
            <div style={styles.summaryNumber}>
              {completedMilestones}
            </div>
            <div style={styles.summaryText}>
              Badges Earned
            </div>
          </div>
        </div>

        {/* MILESTONES */}
        <div style={styles.list}>
          {milestones.map((milestone) => {
            const percentage = Math.min(
              100,
              (milestone.current / milestone.target) *
                100
            );

            const completed =
              milestone.current >= milestone.target;

            return (
              <div
                key={milestone.id}
                style={styles.milestoneCard}
              >
                <div style={styles.row}>
                  <div
                    style={{
                      ...styles.iconCircle,
                      background: milestone.color,
                    }}
                  >
                    {milestone.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={styles.rowBetween}>
                      <div style={styles.milestoneTitle}>
                        {milestone.title}
                      </div>

                      <div
                        style={{
                          ...styles.badge,
                          background: completed
                            ? "#22C55E"
                            : "#E5E7EB",
                          color: completed
                            ? "#fff"
                            : "#374151",
                        }}
                      >
                        {completed
                          ? "✅ Completed"
                          : `${Math.round(
                              percentage
                            )}%`}
                      </div>
                    </div>

                    <div style={styles.progressOuter}>
                      <div
                        style={{
                          ...styles.progressInner,
                          width: `${percentage}%`,
                          background:
                            milestone.color,
                        }}
                      />
                    </div>

                    <div style={styles.progressText}>
                      {milestone.current} /{" "}
                      {milestone.target}
                    </div>
                  </div>
                </div>

                {completed && (
                  <div style={styles.unlocked}>
                    🎉 Achievement Unlocked!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#DBEAFE,#FEF9C3)",
    padding: 20,
    fontFamily: '"Comic Sans MS", cursive',
  },

  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 35,
    padding: 25,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.12)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 25,
    flexWrap: "wrap",
  },

  trophy: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#FACC15,#FB923C)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
  },

  title: {
    margin: 0,
    fontSize: "2rem",
    color: "#111827",
  },

  subtitle: {
    margin: 0,
    color: "#64748B",
  },

  summaryRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 15,
    marginBottom: 25,
  },

  summaryCard: {
    background:
      "linear-gradient(135deg,#F8FAFC,#EEF2FF)",
    borderRadius: 25,
    padding: 20,
    textAlign: "center",
  },

  summaryEmoji: {
    fontSize: "2rem",
  },

  summaryNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: 8,
  },

  summaryText: {
    color: "#64748B",
    marginTop: 5,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  milestoneCard: {
    border: "3px solid #E5E7EB",
    borderRadius: 25,
    padding: 18,
  },

  row: {
    display: "flex",
    gap: 15,
    alignItems: "center",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    flexShrink: 0,
  },

  milestoneTitle: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#111827",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: 20,
    fontWeight: "bold",
    fontSize: 13,
  },

  progressOuter: {
    height: 18,
    background: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressInner: {
    height: "100%",
    borderRadius: 999,
    transition: "0.5s",
  },

  progressText: {
    marginTop: 8,
    color: "#64748B",
    fontWeight: "bold",
  },

  unlocked: {
    marginTop: 10,
    color: "#16A34A",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default KidMilestoneBoard;



            // <NavLink
            //     to="/Kid-Milestone-Board"
            //     style={({ isActive }) => ({
            //         ...styles.link,
            //         background: isActive
            //             ? "#ffcc00"
            //             : "transparent",
            //         color: isActive ? "#000" : "#e05757",
            //         borderRadius: "8px",
            //     })}
            // >
            //     Kid-Milestone-Board
            // </NavLink>