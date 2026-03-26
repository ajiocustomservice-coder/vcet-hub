import { useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

export default function LeaveSection({ user }: Props) {
  const [leaves, setLeaves] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("vcet_leaves") || "[]"),
  );
  const [form, setForm] = useState({ fromDate: "", toDate: "", reason: "" });

  const myLeaves = leaves.filter((l) => l.userId === user.id);

  const submitLeave = () => {
    if (!form.fromDate || !form.toDate || !form.reason) return;
    const newLeave = {
      id: Date.now(),
      userId: user.id,
      fromDate: new Date(form.fromDate).getTime(),
      toDate: new Date(form.toDate).getTime(),
      reason: form.reason,
      status: "pending",
    };
    const updated = [...leaves, newLeave];
    setLeaves(updated);
    localStorage.setItem("vcet_leaves", JSON.stringify(updated));
    setForm({ fromDate: "", toDate: "", reason: "" });
  };

  const updateStatus = (id: number, status: string) => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    setLeaves(updated);
    localStorage.setItem("vcet_leaves", JSON.stringify(updated));
  };

  const statusColor: Record<string, string> = {
    pending: "#fbbf24",
    approved: "#34d399",
    rejected: "#f87171",
  };
  const allLeaves = user.isStaff ? leaves : myLeaves;

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
        Leave Management
      </h2>

      {!user.isStaff && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={sTitle}>Submit Leave Request</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                FROM DATE
              </label>
              <input
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                type="date"
                style={inp}
              />
            </div>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                TO DATE
              </label>
              <input
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                type="date"
                style={inp}
              />
            </div>
          </div>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Reason for leave..."
            style={{ ...inp, minHeight: 80, resize: "vertical" }}
          />
          <button onClick={submitLeave} style={btnPrimary}>
            Submit Request
          </button>
        </div>
      )}

      <div style={glassCard}>
        <h3 style={sTitle}>
          {user.isStaff ? "All Leave Requests" : "My Leave History"}
        </h3>
        {allLeaves.length === 0 ? (
          <div
            style={{ color: "#475569", padding: "20px 0", textAlign: "center" }}
          >
            No leave requests yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allLeaves.map((l) => (
              <div
                key={l.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${statusColor[l.status]}33`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    {user.isStaff && (
                      <div
                        style={{
                          color: "#00d4ff",
                          fontSize: 12,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {l.userId}
                      </div>
                    )}
                    <div style={{ color: "#f1f5f9", fontSize: 13 }}>
                      {l.reason}
                    </div>
                    <div
                      style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}
                    >
                      {new Date(l.fromDate).toLocaleDateString()} —{" "}
                      {new Date(l.toDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${statusColor[l.status]}22`,
                        color: statusColor[l.status],
                        textTransform: "uppercase",
                      }}
                    >
                      {l.status}
                    </span>
                    {user.isStaff && l.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(l.id, "approved")}
                          style={{
                            padding: "4px 10px",
                            background: "rgba(52,211,153,0.2)",
                            border: "1px solid #34d39966",
                            color: "#34d399",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 11,
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => updateStatus(l.id, "rejected")}
                          style={{
                            padding: "4px 10px",
                            background: "rgba(248,113,113,0.2)",
                            border: "1px solid #f8717166",
                            color: "#f87171",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 11,
                          }}
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
