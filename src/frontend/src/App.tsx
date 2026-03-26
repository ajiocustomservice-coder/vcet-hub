import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import LoginPage from "./components/LoginPage";

export interface User {
  id: string;
  name: string;
  department?: string;
  isStaff: boolean;
  password: string;
}

const seedData = () => {
  if (localStorage.getItem("vcet_seeded")) return;
  const users: User[] = [
    {
      id: "23ITR001",
      name: "Alex R",
      department: "IT",
      password: "01012005",
      isStaff: false,
    },
    {
      id: "23CSR001",
      name: "Priya K",
      department: "CSE",
      password: "15032005",
      isStaff: false,
    },
    {
      id: "STAFF001",
      name: "Dr. Kumar",
      isStaff: true,
      password: "password",
      department: "IT",
    },
  ];
  localStorage.setItem("vcet_users", JSON.stringify(users));
  const now = Date.now();
  const day = 86400000;
  const attendance = [
    { studentId: "23ITR001", subject: "OS", present: 38, total: 45 },
    { studentId: "23ITR001", subject: "DBMS", present: 40, total: 48 },
    { studentId: "23ITR001", subject: "CN", present: 28, total: 40 },
    { studentId: "23ITR001", subject: "DSA", present: 42, total: 50 },
    { studentId: "23ITR001", subject: "MATHS", present: 35, total: 42 },
    { studentId: "23CSR001", subject: "JAVA", present: 36, total: 42 },
    { studentId: "23CSR001", subject: "DBMS", present: 30, total: 44 },
    { studentId: "23CSR001", subject: "OS", present: 20, total: 38 },
  ];
  localStorage.setItem("vcet_attendance", JSON.stringify(attendance));
  const materials = [
    {
      id: 1,
      title: "Data Structures Notes",
      subject: "DSA",
      department: "IT",
      link: "https://example.com/dsa.pdf",
      uploadedBy: "STAFF001",
      timestamp: now,
    },
    {
      id: 2,
      title: "Database Design Guide",
      subject: "DBMS",
      department: "IT",
      link: "https://example.com/dbms.pdf",
      uploadedBy: "STAFF001",
      timestamp: now,
    },
    {
      id: 3,
      title: "Computer Networks Slides",
      subject: "CN",
      department: "IT",
      link: "https://example.com/cn.pdf",
      uploadedBy: "STAFF001",
      timestamp: now,
    },
    {
      id: 4,
      title: "OOP Concepts",
      subject: "JAVA",
      department: "CSE",
      link: "https://example.com/java.pdf",
      uploadedBy: "STAFF001",
      timestamp: now,
    },
    {
      id: 5,
      title: "Calculus Handbook",
      subject: "MATHS",
      department: "IT",
      link: "https://example.com/math.pdf",
      uploadedBy: "STAFF001",
      timestamp: now,
    },
  ];
  localStorage.setItem("vcet_materials", JSON.stringify(materials));
  const assignments = [
    {
      id: 1,
      title: "OS Lab Report",
      subject: "OS",
      department: "IT",
      dueDate: now + 3 * day,
      description: "Write lab report on process scheduling algorithms",
      createdBy: "STAFF001",
      priority: "high",
    },
    {
      id: 2,
      title: "DBMS Mini Project",
      subject: "DBMS",
      department: "IT",
      dueDate: now + 7 * day,
      description: "Design an ER diagram for library management",
      createdBy: "STAFF001",
      priority: "medium",
    },
    {
      id: 3,
      title: "CN Assignment",
      subject: "CN",
      department: "IT",
      dueDate: now - 2 * day,
      description: "OSI vs TCP/IP model comparison",
      createdBy: "STAFF001",
      priority: "low",
    },
    {
      id: 4,
      title: "Java Project",
      subject: "JAVA",
      department: "CSE",
      dueDate: now + 5 * day,
      description: "Build a CRUD application in Java",
      createdBy: "STAFF001",
      priority: "high",
    },
  ];
  localStorage.setItem("vcet_assignments", JSON.stringify(assignments));
  const events = [
    {
      id: 1,
      title: "Hackathon 2026",
      description: "24-hour coding challenge open to all departments",
      date: now + 10 * day,
      department: "all",
    },
    {
      id: 2,
      title: "Technical Symposium",
      description: "Paper presentations and project expo",
      date: now + 15 * day,
      department: "IT",
    },
    {
      id: 3,
      title: "Sports Day",
      description: "Annual sports meet for all students",
      date: now + 20 * day,
      department: "all",
    },
  ];
  localStorage.setItem("vcet_events", JSON.stringify(events));
  const reminders = [
    {
      id: 1,
      userId: "23ITR001",
      text: "Submit OS Lab Report by Friday",
      priority: "high",
      dueDate: now + 3 * day,
    },
    {
      id: 2,
      userId: "23ITR001",
      text: "Attend CN remedial class",
      priority: "medium",
      dueDate: now + 1 * day,
    },
    {
      id: 3,
      userId: "23ITR001",
      text: "Register for Hackathon 2026",
      priority: "low",
      dueDate: now + 8 * day,
    },
  ];
  localStorage.setItem("vcet_reminders", JSON.stringify(reminders));
  const leaveRequests = [
    {
      id: 1,
      userId: "23ITR001",
      fromDate: now - 5 * day,
      toDate: now - 4 * day,
      reason: "Medical appointment",
      status: "approved",
    },
    {
      id: 2,
      userId: "23ITR001",
      fromDate: now + 2 * day,
      toDate: now + 3 * day,
      reason: "Family function",
      status: "pending",
    },
  ];
  localStorage.setItem("vcet_leaves", JSON.stringify(leaveRequests));
  localStorage.setItem("vcet_seeded", "true");
};

type AppState = "loading" | "login" | "dashboard";

export default function App() {
  const [state, setState] = useState<AppState>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedData();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setState("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setState("login");
  };

  return (
    <div style={{ fontFamily: "Inter, Poppins, sans-serif" }}>
      {state === "loading" && (
        <LoadingScreen onComplete={() => setState("login")} />
      )}
      {state === "login" && <LoginPage onLogin={handleLogin} />}
      {state === "dashboard" && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
