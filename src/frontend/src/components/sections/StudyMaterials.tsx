import { useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

export default function StudyMaterials({ user }: Props) {
  const [materials, setMaterials] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("vcet_materials") || "[]"),
  );
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [form, setForm] = useState({
    title: "",
    subject: "",
    department: "IT",
    link: "",
  });
  const depts = ["IT", "CSE", "ECE", "MECH", "CIVIL", "EEE", "MBA", "MCA"];

  const visible = materials
    .filter((m) => (!user.isStaff ? m.department === user.department : true))
    .filter(
      (m) =>
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((m) => !catFilter || m.subject === catFilter);

  const subjects = [...new Set(materials.map((m) => m.subject))];

  const upload = () => {
    if (!form.title || !form.subject || !form.link) return;
    const newM = {
      ...form,
      id: Date.now(),
      uploadedBy: user.id,
      timestamp: Date.now(),
    };
    const updated = [...materials, newM];
    setMaterials(updated);
    localStorage.setItem("vcet_materials", JSON.stringify(updated));
    setForm({ title: "", subject: "", department: "IT", link: "" });
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
        Study Materials
      </h2>

      {user.isStaff && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={sTitle}>Upload Material</h3>
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
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="PDF / Link URL"
              style={inp}
            />
          </div>
          <button onClick={upload} style={btnPrimary}>
            ↑ Upload
          </button>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search materials..."
          style={{ ...inp, maxWidth: 280 }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setCatFilter("")}
            style={{
              ...filterBtn,
              border:
                catFilter === ""
                  ? "1px solid #00d4ff"
                  : "1px solid rgba(255,255,255,0.1)",
              color: catFilter === "" ? "#00d4ff" : "#64748b",
            }}
          >
            All
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setCatFilter(s)}
              style={{
                ...filterBtn,
                border:
                  catFilter === s
                    ? "1px solid #00d4ff"
                    : "1px solid rgba(255,255,255,0.1)",
                color: catFilter === s ? "#00d4ff" : "#64748b",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))",
          gap: 16,
        }}
      >
        {visible.map((m) => (
          <div
            key={m.id}
            style={{ ...glassCard, transition: "all 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid rgba(0,212,255,0.4)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid rgba(0,212,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📎</div>
            <div
              style={{
                color: "#f1f5f9",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 6,
              }}
            >
              {m.title}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 12,
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
                {m.subject}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "rgba(168,85,247,0.1)",
                  color: "#a855f7",
                }}
              >
                {m.department}
              </span>
            </div>
            <div style={{ color: "#64748b", fontSize: 11, marginBottom: 12 }}>
              Uploaded: {new Date(m.timestamp).toLocaleDateString()}
            </div>
            <a
              href={m.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 0",
                background:
                  "linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.15))",
                border: "1px solid rgba(0,212,255,0.3)",
                borderRadius: 10,
                color: "#00d4ff",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg,rgba(0,212,255,0.3),rgba(168,85,247,0.3))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.15))")
              }
            >
              ↓ Download
            </a>
          </div>
        ))}
      </div>
      {visible.length === 0 && (
        <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
          No materials found.
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
const filterBtn: React.CSSProperties = {
  padding: "6px 14px",
  background: "rgba(0,0,0,0.3)",
  borderRadius: 20,
  cursor: "pointer",
  fontSize: 12,
  transition: "all 0.2s",
};
