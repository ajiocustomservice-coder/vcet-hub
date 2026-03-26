import { useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

export default function Assignments({ user }: Props) {
  const [assignments, setAssignments] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("vcet_assignments") || "[]"),
  );
  const [form, setForm] = useState({
    title: "",
    subject: "",
    department: "IT",
    dueDate: "",
    description: "",
    priority: "medium",
  });
  const [filter, setFilter] = useState("");

  const filtered = assignments
    .filter((a) => user.isStaff || a.department === user.department)
    .filter(
      (a) => !filter || a.subject.toLowerCase().includes(filter.toLowerCase()),
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
  const depts = ["IT", "CSE", "ECE", "MECH", "CIVIL", "EEE", "MBA", "MCA"];

  const addAssignment = () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    const newA = {
      ...form,
      id: Date.now(),
      dueDate: new Date(form.dueDate).getTime(),
      createdBy: user.id,
    };
    const updated = [...assignments, newA];
    setAssignments(updated);
    localStorage.setItem("vcet_assignments", JSON.stringify(updated));
    setForm({
      title: "",
      subject: "",
      department: "IT",
      dueDate: "",
      description: "",
      priority: "medium",
    });
  };

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
        Assignments
      </h2>

      {user.isStaff && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={sTitle}>Add Assignment</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 12,
            }}
          >
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              style={inp}
            />
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              style={inp}
            />
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              style={inp}
            >
              {depts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              type="date"
              style={inp}
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={inp}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            style={{
              ...inp,
              width: "100%",
              marginTop: 12,
              resize: "vertical",
              minHeight: 80,
            }}
          />
          <button onClick={addAssignment} style={btnPrimary}>
            + Add Assignment
          </button>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="🔍 Filter by subject..."
          style={{ ...inp, maxWidth: 300 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        {filtered.map((a) => {
          const dl = getDaysLeft(a.dueDate);
          return (
            <div
              key={a.id}
              style={{
                ...glassCard,
                borderLeft: `3px solid ${priorityColor[a.priority]}`,
                boxShadow: `0 0 16px ${priorityColor[a.priority]}22`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 15 }}
                  >
                    {a.title}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                    {a.subject} • {a.department}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: priorityColor[a.priority],
                    background: `${priorityColor[a.priority]}22`,
                    padding: "3px 8px",
                    borderRadius: 20,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.priority}
                </span>
              </div>
              {a.description && (
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {a.description}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 11 }}>
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </span>
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
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
          No assignments found.
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
