import type React from "react";
import { useState } from "react";
import type { User } from "../App";
import AIAssistant from "./sections/AIAssistant";
import Assignments from "./sections/Assignments";
import AttendanceSection from "./sections/Attendance";
import BusTracker from "./sections/BusTracker";
import DashboardHome from "./sections/DashboardHome";
import EventsSection from "./sections/Events";
import LeaveSection from "./sections/Leave";
import StudyMaterials from "./sections/StudyMaterials";

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
  onLogout: () => void;
}

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "home", label: "Dashboard", icon: "🏠" },
  { id: "assignments", label: "Assignments", icon: "📚" },
  { id: "attendance", label: "Attendance", icon: "📊" },
  { id: "leave", label: "Leave", icon: "📅" },
  { id: "events", label: "Events", icon: "⭐" },
  { id: "materials", label: "Study Materials", icon: "📖" },
  { id: "ai", label: "AI Assistant", icon: "🤖" },
  { id: "bus", label: "Bus Tracker", icon: "🚌" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function Dashboard({ user, onLogout }: Props) {
  const [active, setActive] = useState<Section>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionComponents: Record<Section, React.ReactElement> = {
    home: <DashboardHome user={user} onNavigate={setActive} />,
    assignments: <Assignments user={user} />,
    attendance: <AttendanceSection user={user} />,
    leave: <LeaveSection user={user} />,
    events: <EventsSection user={user} />,
    materials: <StudyMaterials user={user} />,
    ai: <AIAssistant user={user} />,
    bus: <BusTracker />,
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b1120",
        color: "#f1f5f9",
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          minHeight: "100vh",
          background: "rgba(10,18,35,0.95)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(0,212,255,0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          height: "100%",
          transition: "transform 0.3s",
          transform:
            window.innerWidth < 768
              ? sidebarOpen
                ? "translateX(0)"
                : "translateX(-100%)"
              : "translateX(0)",
        }}
      >
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "0.05em",
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ⬡ VCET HUB
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: 10,
              letterSpacing: "0.15em",
              marginTop: 2,
            }}
          >
            SMART ACADEMIC SYSTEM
          </div>
        </div>

        <nav
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                setSidebarOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                background:
                  active === item.id
                    ? "linear-gradient(135deg,rgba(0,212,255,0.15),rgba(168,85,247,0.1))"
                    : "transparent",
                color: active === item.id ? "#00d4ff" : "#64748b",
                fontWeight: active === item.id ? 600 : 400,
                fontSize: 14,
                boxShadow:
                  active === item.id
                    ? "0 0 16px rgba(0,212,255,0.15), inset 0 0 0 1px rgba(0,212,255,0.2)"
                    : "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (active !== item.id) e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background =
                  active === item.id ? "" : "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (active !== item.id) {
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ padding: "8px 14px", marginBottom: 8 }}>
            <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>
              {user.name}
            </div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>
              {user.isStaff ? "Staff" : `${user.department} Department`}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "12px 14px",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              background: "rgba(248,113,113,0.1)",
              color: "#f87171",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
            }
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          marginLeft: window.innerWidth >= 768 ? 260 : 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(10,18,35,0.6)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: window.innerWidth < 768 ? "flex" : "none",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: 20,
                alignItems: "center",
              }}
            >
              ☰
            </button>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 16 }}>
                {getGreeting()}, {user.name}! 👋
              </div>
              <div style={{ color: "#475569", fontSize: 12 }}>
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f87171",
                  boxShadow: "0 0 6px #f87171",
                }}
              />
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {user.name[0]}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {sectionComponents[active]}
        </div>
      </main>
    </div>
  );
}
