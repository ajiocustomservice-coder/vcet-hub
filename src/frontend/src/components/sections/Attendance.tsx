import { useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

export default function AttendanceSection({ user }: Props) {
  const [attendance, setAttendance] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("vcet_attendance") || "[]"),
  );
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    present: "",
    total: "",
  });

  const mine = attendance.filter((a) => a.studentId === user.id);

  const updateAtt = () => {
    if (!form.studentId || !form.subject) return;
    const existing = attendance.findIndex(
      (a) => a.studentId === form.studentId && a.subject === form.subject,
    );
    let updated: any[];
    if (existing >= 0) {
      updated = attendance.map((a, i) =>
        i === existing
          ? {
              ...a,
              present: Number.parseInt(form.present),
              total: Number.parseInt(form.total),
            }
          : a,
      );
    } else {
      updated = [
        ...attendance,
        {
          studentId: form.studentId,
          subject: form.subject,
          present: Number.parseInt(form.present),
          total: Number.parseInt(form.total),
        },
      ];
    }
    setAttendance(updated);
    localStorage.setItem("vcet_attendance", JSON.stringify(updated));
    setForm({ studentId: "", subject: "", present: "", total: "" });
  };

  const records = user.isStaff ? attendance : mine;

  return (
    <div style={{ animation: "fadeSlide 0.4s ease" }}>
      <h2
        style={{
          color: "#f1f5f9",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        Attendance
      </h2>

      {user.isStaff && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={sTitle}>Update Attendance</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 12,
            }}
          >
            <input
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              placeholder="Student ID"
              style={inp}
            />
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              style={inp}
            />
            <input
              value={form.present}
              onChange={(e) => setForm({ ...form, present: e.target.value })}
              placeholder="Present"
              type="number"
              style={inp}
            />
            <input
              value={form.total}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
              placeholder="Total"
              type="number"
              style={inp}
            />
          </div>
          <button onClick={updateAtt} style={btnPrimary}>
            Update
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 16,
        }}
      >
        {records.map((a, i) => {
          const pct = Math.round((a.present / a.total) * 100);
          const low = pct < 75;
          const color = low ? "#f87171" : "#34d399";
          const circ = 2 * Math.PI * 40;
          return (
            <div
              key={i}
              style={{
                ...glassCard,
                border: `1px solid ${low ? "rgba(248,113,113,0.3)" : "rgba(0,212,255,0.1)"}`,
                boxShadow: low ? "0 0 20px rgba(248,113,113,0.1)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg
                  width={96}
                  height={96}
                  style={{ overflow: "visible", flexShrink: 0 }}
                >
                  <circle
                    cx={48}
                    cy={48}
                    r={40}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={8}
                  />
                  <circle
                    cx={48}
                    cy={48}
                    r={40}
                    fill="none"
                    stroke={color}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    transform="rotate(-90 48 48)"
                    style={{
                      filter: `drop-shadow(0 0 8px ${color})`,
                      transition: "stroke-dashoffset 1s ease",
                    }}
                  />
                  <text
                    x={48}
                    y={52}
                    textAnchor="middle"
                    fill={color}
                    fontSize={16}
                    fontWeight={800}
                  >
                    {pct}%
                  </text>
                </svg>
                <div>
                  <div
                    style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}
                  >
                    {a.subject}
                  </div>
                  {user.isStaff && (
                    <div
                      style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}
                    >
                      {a.studentId}
                    </div>
                  )}
                  <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
                    {a.present}/{a.total} classes
                  </div>
                  {low && (
                    <div
                      style={{
                        color: "#f87171",
                        fontSize: 12,
                        marginTop: 6,
                        fontWeight: 600,
                      }}
                    >
                      ⚠️ Below 75% — Attendance Low!
                    </div>
                  )}
                  {!low && (
                    <div
                      style={{ color: "#34d399", fontSize: 12, marginTop: 6 }}
                    >
                      ✓ Good Standing
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {records.length === 0 && (
        <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
          No attendance records found.
        </div>
      )}
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
const sTitle: React.CSSProperties = {
  color: "#f1f5f9",
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 14,
  marginTop: 0,
};
const inp: React.CSSProperties = {
  padding: "10px 14px",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(0,212,255,0.15)",
  borderRadius: 10,
  color: "#f1f5f9",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 20px",
  background: "linear-gradient(135deg,#00d4ff,#a855f7)",
  border: "none",
  borderRadius: 10,
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};
