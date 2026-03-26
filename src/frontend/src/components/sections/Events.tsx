import { useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

export default function EventsSection({ user }: Props) {
  const [events, setEvents] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("vcet_events") || "[]"),
  );
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    department: "all",
  });
  const depts = [
    "all",
    "IT",
    "CSE",
    "ECE",
    "MECH",
    "CIVIL",
    "EEE",
    "MBA",
    "MCA",
  ];

  const addEvent = () => {
    if (!form.title || !form.date) return;
    const newE = {
      ...form,
      id: Date.now(),
      date: new Date(form.date).getTime(),
    };
    const updated = [...events, newE];
    setEvents(updated);
    localStorage.setItem("vcet_events", JSON.stringify(updated));
    setForm({ title: "", description: "", date: "", department: "all" });
  };

  const visible = events.filter(
    (e) =>
      e.department === "all" ||
      e.department === user.department ||
      user.isStaff,
  );
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

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
        Events
      </h2>

      {user.isStaff && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={sTitle}>Create Event</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: 12,
            }}
          >
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Event Title"
              style={inp}
            />
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              type="date"
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
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            style={{ ...inp, marginTop: 12, minHeight: 72, resize: "vertical" }}
          />
          <button onClick={addEvent} style={btnPrimary}>
            + Create Event
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        {visible.map((e) => {
          const d = new Date(e.date);
          return (
            <div key={e.id} style={glassCard}>
              <div
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    minWidth: 56,
                    height: 56,
                    borderRadius: 12,
                    flexShrink: 0,
                    background:
                      "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(168,85,247,0.2))",
                    border: "1px solid rgba(0,212,255,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      color: "#00d4ff",
                      fontSize: 20,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {d.getDate()}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 10,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {months[d.getMonth()]}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#f1f5f9",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    {e.title}
                  </div>
                  <div
                    style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}
                  >
                    {e.description}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "rgba(0,212,255,0.1)",
                        color: "#00d4ff",
                      }}
                    >
                      {e.department === "all"
                        ? "All Departments"
                        : e.department}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.05)",
                        color: "#64748b",
                      }}
                    >
                      {d.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
          No upcoming events.
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
