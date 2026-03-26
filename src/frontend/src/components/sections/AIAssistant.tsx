import { useEffect, useRef, useState } from "react";
import type { User } from "../../App";
interface Props {
  user: User;
}

const responses: Record<string, string> = {
  attendance:
    "Your attendance is tracked in the Attendance section. Make sure to maintain above 75% to avoid detention! You can view subject-wise breakdown there.",
  assignment:
    "Check the Assignments section for all pending work with countdown timers and priority badges. Overdue ones are highlighted in red!",
  leave:
    "You can submit leave requests in the Leave section. Fill in the from/to dates and reason. Staff will approve or reject them.",
  bus: "The Bus Tracker shows 4 routes around Madurai/VCET area. Use the route selector to view specific routes with animated markers on the map.",
  study:
    "Study materials uploaded by staff are available in the Study Materials section, filtered by your department. You can search by title or filter by subject.",
  material:
    "Study materials uploaded by staff are available in the Study Materials section, filtered by your department.",
  exam: "Exam schedules will be posted in the Events section. Keep an eye on upcoming events for important dates!",
  schedule:
    "Your schedule and timetable updates are posted in Events. Check there for the latest information.",
  help: "I can help with: \u2022 Attendance queries\n\u2022 Assignment due dates\n\u2022 Leave requests\n\u2022 Bus routes\n\u2022 Study materials\n\u2022 Events & exams\n\nJust type your question!",
  hello: "Hello! I'm VCET AI Assistant \ud83e\udd16 How can I help you today?",
  hi: "Hi there! Ready to assist you with all your academic needs! Type 'help' to see what I can do.",
  hey: "Hey! Great to see you. How can I assist you today?",
  marks:
    "For marks and grades, check with your department coordinator or the student portal. Academic results are announced officially.",
  fee: "For fee-related queries, please contact the college accounts department or visit the finance office.",
  hostel:
    "For hostel-related queries, please contact the hostel warden or the student services office.",
  default:
    "I understand your query! Please check the relevant section in the dashboard, or ask me specifically about attendance, assignments, leave, bus, or study materials. Type 'help' for a full list!",
};

const quickPrompts = [
  "What's my attendance?",
  "Show assignments",
  "How to apply leave?",
  "Bus routes",
  "Study materials",
  "Help",
];

interface Message {
  role: "user" | "ai";
  text: string;
  time: Date;
}

export default function AIAssistant({ user }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `Hello ${user.name}! I'm your VCET AI Assistant \ud83e\udd16 Ask me anything about attendance, assignments, leave, bus routes, or study materials!`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getResponse = (msg: string): string => {
    const lower = msg.toLowerCase();
    for (const key of Object.keys(responses)) {
      if (lower.includes(key)) return responses[key];
    }
    return responses.default;
  };

  const send = (text: string = input) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        const aiMsg: Message = {
          role: "ai",
          text: getResponse(text),
          time: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
      },
      1200 + Math.random() * 600,
    );
  };

  return (
    <div
      style={{
        animation: "fadeSlide 0.4s ease",
        height: "calc(100vh - 160px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          color: "#f1f5f9",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        AI Assistant
      </h2>

      {/* Quick prompts */}
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}
      >
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            style={{
              padding: "6px 14px",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 20,
              color: "#00d4ff",
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,212,255,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,212,255,0.08)")
            }
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "rgba(5,10,20,0.5)",
          borderRadius: 16,
          border: "1px solid rgba(0,212,255,0.1)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            {m.role === "ai" && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  boxShadow: "0 0 12px rgba(0,212,255,0.4)",
                }}
              >
                🤖
              </div>
            )}
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius:
                  m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg,rgba(0,212,255,0.2),rgba(168,85,247,0.2))"
                    : "rgba(15,23,42,0.8)",
                border: `1px solid ${m.role === "user" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: "#f1f5f9",
                fontSize: 13,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
              <div
                style={{
                  color: "#475569",
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {m.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            {m.role === "user" && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#a855f7,#00d4ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flexShrink: 0,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user.name[0]}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🤖
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00d4ff",
                      display: "inline-block",
                      animation: `dotPulse 1.4s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask me anything about VCET..."
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 12,
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={() => send()}
          style={{
            padding: "12px 20px",
            background: "linear-gradient(135deg,#00d4ff,#a855f7)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Send ➤
        </button>
      </div>
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotPulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }
      `}</style>
    </div>
  );
}
