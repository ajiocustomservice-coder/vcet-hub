import { useState } from "react";
import type { User } from "../App";

interface Props {
  onLogin: (u: User) => void;
}

const detectDepartment = (regNo: string): string => {
  const u = regNo.toUpperCase();
  if (u.includes("MECHR")) return "MECH";
  if (u.includes("CIVR")) return "CIVIL";
  if (u.includes("EEER")) return "EEE";
  if (u.includes("MBAR")) return "MBA";
  if (u.includes("MCAR")) return "MCA";
  if (u.includes("ITR")) return "IT";
  if (u.includes("CSR")) return "CSE";
  if (u.includes("ECR")) return "ECE";
  return "";
};

export default function LoginPage({ onLogin }: Props) {
  const [tab, setTab] = useState<"student" | "staff">("student");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [error, setError] = useState("");
  const dept = detectDepartment(regNo);

  const handleLogin = () => {
    setError("");
    const users: User[] = JSON.parse(
      localStorage.getItem("vcet_users") || "[]",
    );
    if (tab === "student") {
      const u = users.find(
        (x) => x.id === regNo && x.password === password && !x.isStaff,
      );
      if (u) {
        onLogin(u);
      } else {
        setError(
          "Invalid register number or password (use DOB as password, e.g. 01012005)",
        );
      }
    } else {
      const u = users.find(
        (x) => x.id === staffId && x.password === staffPass && x.isStaff,
      );
      if (u) {
        onLogin(u);
      } else {
        setError("Invalid staff credentials");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #0b1120 50%, #13072e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(0,212,255,0.06)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(168,85,247,0.07)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(15,23,42,0.8)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow:
            "0 0 40px rgba(0,212,255,0.1), 0 0 80px rgba(168,85,247,0.05)",
          animation: "slideUp 0.5s ease forwards",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "0.05em",
              background: "linear-gradient(135deg, #00d4ff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 12px rgba(0,212,255,0.5))",
            }}
          >
            <span style={{ fontSize: 28 }}>⬡</span> VCET HUB
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: 12,
              letterSpacing: "0.15em",
              marginTop: 4,
            }}
          >
            SMART ACADEMIC INTELLIGENCE
          </div>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            position: "relative",
          }}
        >
          <button
            onClick={() => setTab("student")}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              background:
                tab === "student"
                  ? "linear-gradient(135deg,#00d4ff22,#a855f722)"
                  : "transparent",
              color: tab === "student" ? "#00d4ff" : "#64748b",
              boxShadow:
                tab === "student" ? "0 0 16px rgba(0,212,255,0.2)" : "none",
              transition: "all 0.3s",
            }}
          >
            Student
          </button>
          <button
            onClick={() => setTab("staff")}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              background:
                tab === "staff"
                  ? "linear-gradient(135deg,#a855f722,#00d4ff22)"
                  : "transparent",
              color: tab === "staff" ? "#a855f7" : "#64748b",
              boxShadow:
                tab === "staff" ? "0 0 16px rgba(168,85,247,0.2)" : "none",
              transition: "all 0.3s",
            }}
          >
            Staff
          </button>
        </div>

        {tab === "student" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                REGISTER NUMBER
              </label>
              <input
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. 23ITR001"
                style={inputStyle}
              />
              {dept && (
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.3)",
                    borderRadius: 20,
                    padding: "3px 12px",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00d4ff",
                      display: "inline-block",
                      boxShadow: "0 0 8px #00d4ff",
                    }}
                  />
                  <span
                    style={{ color: "#00d4ff", fontSize: 12, fontWeight: 600 }}
                  >
                    {dept} Department
                  </span>
                </div>
              )}
            </div>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                PASSWORD (Date of Birth)
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="DDMMYYYY e.g. 01012005"
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                STAFF ID
              </label>
              <input
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="e.g. STAFF001"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                NAME
              </label>
              <input
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Dr. Kumar"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                PASSWORD
              </label>
              <input
                value={staffPass}
                onChange={(e) => setStaffPass(e.target.value)}
                type="password"
                placeholder="Enter password"
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#f87171",
              fontSize: 12,
              marginTop: 12,
              padding: "8px 12px",
              background: "rgba(248,113,113,0.1)",
              borderRadius: 8,
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: 24,
            padding: "14px 0",
            border: "none",
            borderRadius: 12,
            background: "linear-gradient(135deg, #00d4ff, #a855f7)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: "0.05em",
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 40px rgba(0,212,255,0.6), 0 0 80px rgba(168,85,247,0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.3)")
          }
        >
          LOGIN →
        </button>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: 11,
              letterSpacing: "0.1em",
              marginBottom: 6,
            }}
          >
            DEMO CREDENTIALS
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>
            Student: <span style={{ color: "#00d4ff" }}>23ITR001</span> /{" "}
            <span style={{ color: "#00d4ff" }}>01012005</span>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
            Staff: <span style={{ color: "#a855f7" }}>STAFF001</span> /{" "}
            <span style={{ color: "#a855f7" }}>password</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(0,212,255,0.15)",
  borderRadius: 10,
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.3s",
  boxSizing: "border-box",
};
