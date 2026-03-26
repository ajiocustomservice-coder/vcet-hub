import type { User } from "../../App";
type Section =
  | "home"
  | "assignments"
  | "attendance"
  | "leave"
  | "events"
  | "materials"
  | "ai"
  | "bus";
interface Props {
  user: User;
  onNavigate: (s: Section) => void;
}

export default function DashboardHome({ user, onNavigate }: Props) {
  const attendance: {
    studentId: string;
    subject: string;
    present: number;
    total: number;
  }[] = JSON.parse(localStorage.getItem("vcet_attendance") || "[]").filter(
    (a: any) => a.studentId === user.id,
  );
  const assignments: any[] = JSON.parse(
    localStorage.getItem("vcet_assignments") || "[]",
  ).filter((a: any) => a.department === user.department || user.isStaff);
  const reminders: any[] = JSON.parse(
    localStorage.getItem("vcet_reminders") || "[]",
  ).filter((r: any) => r.userId === user.id);
  const events: any[] = JSON.parse(localStorage.getItem("vcet_events") || "[]");

  const streak = Number.parseInt(
    localStorage.getItem(`vcet_streak_${user.id}`) || "1",
  );
  const avgAtt = attendance.length
    ? Math.round(
        attendance.reduce((s, a) => s + (a.present / a.total) * 100, 0) /
          attendance.length,
      )
    : 0;
  const pendingAssign = assignments.filter(
    (a) => a.dueDate > Date.now(),
  ).length;
  const productivity = Math.min(
    100,
    Math.round(avgAtt * 0.5 + streak * 5 + (pendingAssign > 0 ? 20 : 30)),
  );

  const getDaysLeft = (due: number) => {
    const diff = Math.ceil((due - Date.now()) / 86400000);
    if (diff < 0) return { label: "OVERDUE", color: "#f87171" };
    if (diff === 0) return { label: "DUE TODAY", color: "#fbbf24" };
    return { label: `${diff}d left`, color: diff <= 3 ? "#fbbf24" : "#34d399" };
  };

  const priorityColor: Record<string, string> = {
    high: "#f87171",
    medium: "#fbbf24",
    low: "#60a5fa",
  };

  return (
    <div style={{ animation: "fadeSlide 0.4s ease" }}>
      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Avg. Attendance",
            value: `${avgAtt}%`,
            icon: "📊",
            color: "#00d4ff",
            alert: avgAtt < 75,
          },
          {
            label: "Assignments Due",
            value: String(pendingAssign),
            icon: "📚",
            color: "#a855f7",
          },
          {
            label: "Login Streak",
            value: `${streak} 🔥`,
            icon: "⚡",
            color: "#fbbf24",
          },
          {
            label: "Productivity Score",
            value: `${productivity}%`,
            icon: "🎯",
            color: "#34d399",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "rgba(15,23,42,0.7)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${card.alert ? "rgba(248,113,113,0.4)" : "rgba(0,212,255,0.1)"}`,
              borderRadius: 16,
              padding: 20,
              boxShadow: card.alert
                ? "0 0 20px rgba(248,113,113,0.15)"
                : "none",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: card.alert ? "#f87171" : card.color,
              }}
            >
              {card.value}
            </div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
              {card.label}
            </div>
            {card.alert && (
              <div
                style={{
                  color: "#f87171",
                  fontSize: 11,
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                ⚠️ Attendance Low!
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 20,
        }}
      >
        {/* Attendance rings */}
        {!user.isStaff && attendance.length > 0 && (
          <div style={glassCard}>
            <h3 style={sectionTitle}>Attendance Overview</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {attendance.map((a) => {
                const pct = Math.round((a.present / a.total) * 100);
                const low = pct < 75;
                const color = low ? "#f87171" : "#34d399";
                const circ = 2 * Math.PI * 28;
                return (
                  <div
                    key={a.subject}
                    style={{ textAlign: "center", minWidth: 80 }}
                  >
                    <svg width={72} height={72} style={{ overflow: "visible" }}>
                      <circle
                        cx={36}
                        cy={36}
                        r={28}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={6}
                      />
                      <circle
                        cx={36}
                        cy={36}
                        r={28}
                        fill="none"
                        stroke={color}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - pct / 100)}
                        transform="rotate(-90 36 36)"
                        style={{
                          filter: `drop-shadow(0 0 6px ${color})`,
                          transition: "stroke-dashoffset 1s ease",
                        }}
                      />
                      <text
                        x={36}
                        y={40}
                        textAnchor="middle"
                        fill={color}
                        fontSize={13}
                        fontWeight={700}
                      >
                        {pct}%
                      </text>
                    </svg>
                    <div
                      style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}
                    >
                      {a.subject}
                    </div>
                    {low && (
                      <div style={{ color: "#f87171", fontSize: 10 }}>
                        ⚠️ Low
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reminders */}
        {reminders.length > 0 && (
          <div style={glassCard}>
            <h3 style={sectionTitle}>Smart Reminders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reminders.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.2)",
                    borderLeft: `3px solid ${priorityColor[r.priority]}`,
                    boxShadow: `0 0 12px ${priorityColor[r.priority]}22`,
                  }}
                >
                  <div style={{ color: "#f1f5f9", fontSize: 13 }}>{r.text}</div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                    <span
                      style={{
                        color: priorityColor[r.priority],
                        textTransform: "uppercase",
                        fontSize: 10,
                        fontWeight: 700,
                        marginRight: 8,
                      }}
                    >
                      {r.priority}
                    </span>
                    {new Date(r.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments */}
        {assignments.length > 0 && (
          <div style={glassCard}>
            <h3 style={sectionTitle}>Recent Assignments</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {assignments.slice(0, 4).map((a) => {
                const dl = getDaysLeft(a.dueDate);
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#f1f5f9",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {a.title}
                      </div>
                      <div
                        style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}
                      >
                        {a.subject}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: dl.color,
                        background: `${dl.color}22`,
                        padding: "3px 8px",
                        borderRadius: 20,
                      }}
                    >
                      {dl.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigate("assignments")}
              style={{
                marginTop: 12,
                background: "transparent",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "#00d4ff",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              View All →
            </button>
          </div>
        )}

        {/* Events */}
        <div style={glassCard}>
          <h3 style={sectionTitle}>Upcoming Events</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.slice(0, 3).map((e) => (
              <div
                key={e.id}
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    minWidth: 44,
                    height: 44,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(168,85,247,0.2))",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{ color: "#00d4ff", fontSize: 13, fontWeight: 700 }}
                  >
                    {new Date(e.date).getDate()}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 9 }}>
                    {new Date(e.date)
                      .toLocaleString("default", { month: "short" })
                      .toUpperCase()}
                  </div>
                </div>
                <div>
                  <div
                    style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 500 }}
                  >
                    {e.title}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                    {e.description.slice(0, 50)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {
          "@keyframes fadeSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }"
        }
      </style>
    </div>
  );
}

const glassCard: React.CSSProperties = {
  background: "rgba(15,23,42,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(0,212,255,0.1)",
  borderRadius: 16,
  padding: 20,
};
const sectionTitle: React.CSSProperties = {
  color: "#f1f5f9",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.05em",
  marginBottom: 16,
  marginTop: 0,
};
