# ⚡ LearnFlow — E-Learning Platform

A fully functional, responsive E-Learning UI built with vanilla HTML, CSS, and JavaScript.
No frameworks. No build step. Open `index.html` and go.

---

## 📁 Project Structure

```
elearn/
├── index.html              ← Main HTML shell (no inline JS/CSS)
│
├── css/
│   ├── base.css            ← Design tokens, reset, nav, buttons, toasts, animations
│   ├── components.css      ← Hero, search bar, course cards, detail page
│   └── pages.css           ← Lesson view, quiz, dashboard
│
├── js/
│   ├── storage.js          ← localStorage wrapper + reactive State object
│   ├── data.js             ← Async JSON loader (courses, lessons, quizzes)
│   ├── ui.js               ← Router, Toast, NotifPanel, nav XP helpers
│   ├── courses.js          ← Course listing + detail page logic
│   ├── lesson.js           ← Lesson view, video player, mark-complete, nav
│   ├── quiz.js             ← Full quiz engine (select → submit → feedback → result)
│   ├── dashboard.js        ← Dashboard render (stats, charts, history, badges)
│   ├── home.js             ← Home page render
│   └── app.js              ← Entry point — wires everything on DOMContentLoaded
│
└── data/
    ├── courses.json        ← 6 courses with metadata
    ├── lessons.json        ← 30 lessons with content
    └── quizzes.json        ← 2 question banks (quiz1, quiz2), 5 questions each
```

---

## ✅ Features Implemented

### Required
- **Course Listing** — grid with thumbnail, title, description, category, level badge, duration, students, "View Course"
- **Search & Filters** — by title/desc/category, filter by category & level, sort by popularity/duration/level
- **Course Detail Page** — cover, description, tags, stats, lesson list, Enroll button
- **Lesson View** — content, simulated video player with progress, mark-as-complete, prev/next nav
- **Quiz System** — MCQ, radio selection, submit, correct/wrong feedback with explanation, score screen
- **Dashboard** — enrolled count, completed courses, lessons done, XP, progress bars, quiz history table
- **LocalStorage** — enrolled courses, lesson progress, quiz history, XP — all persisted across refresh

### Optional (all included)
- 🔔 **Notifications panel** — unread count, mark all read
- 🏆 **Badge system** — Beginner (100 XP) / Achiever (500 XP) / Expert (1000 XP)
- 🥇 **Achievements grid** — 6 unlockable achievements based on activity
- ⚡ **XP system** — enroll +50 XP, lesson complete +30 XP, quiz score × 0.5 XP
- 📊 **Data visualisation** — category bar chart + level pie breakdown in dashboard
- 🎨 **Animations** — fade-up card entrance, slide-down notification, toast slide-in, hover effects
- 📱 **Fully responsive** — desktop (3-col), tablet (2-col), mobile (1-col)
- 🎬 **Simulated video player** — progress bar auto-fills on play

---

## 🚀 How to Run

### Option 1 — Live Server (recommended)
```bash
cd elearn
npx live-server
# or use VS Code → "Go Live"
```

### Option 2 — Python server
```bash
cd elearn
python -m http.server 8080
# open http://localhost:8080
```

> ⚠️ **Do NOT open `index.html` directly** via `file://` — the `fetch()` calls for JSON data require a local HTTP server.

---

## 🛠️ Tech Stack

| Layer    | Choice              | Why                          |
|----------|---------------------|------------------------------|
| HTML     | Semantic HTML5      | Clean structure, accessible  |
| CSS      | Vanilla CSS + vars  | No build step, design tokens |
| JS       | Vanilla ES6+        | Modules via IIFE pattern     |
| Data     | JSON files          | Simulates a real API         |
| Storage  | localStorage        | Zero backend needed          |
| Fonts    | Google Fonts        | Space Grotesk + Inter + JetBrains Mono |

---

## 📐 Architecture

All JavaScript follows the **IIFE module pattern** — each file exposes one object:

```
Storage  →  thin localStorage wrapper
State    →  reactive app state backed by Storage
Data     →  async loader for JSON files
Router   →  page switcher with registered callbacks
Toast    →  show(type, message) utility
NotifPanel → notification dropdown
CoursesPage / DetailPage / LessonPage / QuizPage / Dashboard / HomePage
app.js   →  wires event listeners, boots the app
```

No global variables pollute the namespace except the exported module objects.
