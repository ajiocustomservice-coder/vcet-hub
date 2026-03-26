# VCET HUB – Smart Academic Intelligence System

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Full-screen animated loading/welcome screen with Tamil text, neon glow, particle animation, spinner (3-4s delay)
- Login page with glassmorphism panel, Student/Staff toggle
  - Student: register number + DOB password, auto-detect department from prefix (ITR→IT, CSR→CSE, ECR→ECE, MECH→MECH, CIVIL→CIVIL, EEE→EEE, MBA→MBA, MCA→MCA)
  - Staff: name/staff ID + password
- Dashboard with futuristic dark theme, neon highlights, animated sidebar
  - Sidebar sections: Dashboard, Assignments, Attendance, Leave, Events, Study Materials, AI Assistant, Bus Tracker, Logout
  - Animated notifications, toast alerts, productivity score widget
  - Dynamic greeting (Good Morning/Afternoon/Evening)
  - Daily login streak counter
  - Smart reminders with priority glow (High=Red, Medium=Yellow, Low=Blue)
- Study Materials section
  - Staff upload form: title, subject, department dropdown, PDF/image link
  - Student view: filtered by department, neon glassmorphism cards, search bar, category filter, animated download button
- Bus Tracker section using Leaflet.js
  - Multiple bus routes with animated markers on VCET campus area
  - Route selection dropdown, neon tooltips
- AI Assistant chat panel
  - Predefined intelligent responses, animated typing effect, neon chat UI
- Assignments section: countdown timers, add/view assignments
- Attendance section: circular progress per subject, alert when <75%
- Leave section: submit leave request form, view status
- Events section: upcoming events cards with dates

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko): store users (students/staff), study materials, assignments, leave requests, events, reminders
2. Frontend: full SPA with React Router-like state management (no router needed, use useState for current view)
3. Loading screen component with particle canvas animation, Tamil text, spinner
4. Login component with glassmorphism, toggle, department detection
5. Dashboard layout: sidebar + main content area
6. Each section as a separate React component
7. Bus Tracker: integrate Leaflet.js via CDN/npm with custom dark tile layer
8. AI Assistant: predefined QA pairs with typing animation
9. LocalStorage + backend for data persistence
10. Fully responsive CSS with glassmorphism, neon glow utilities
