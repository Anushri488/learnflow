# ⚡ LearnFlow — E-Learning Platform

> A full-stack e-learning platform where you can browse courses, track progress, take quizzes, earn XP, and learn skills that actually matter.

---

## 🌐 Live Links

| | Link |
|---|---|
| 🎯 **Live Demo (Frontend)** | [https://anushri488.github.io/learnflow](https://anushri488.github.io/learnflow) |
| 🚀 **Backend API** | [https://learnflow-backend-do84.onrender.com](https://learnflow-backend-do84.onrender.com) |
| 📁 **GitHub Repository** | [https://github.com/Anushri488/learnflow](https://github.com/Anushri488/learnflow) |

---

## ✨ Features

- 🔐 **User Authentication** — Register & Login with JWT tokens
- 📚 **Browse Courses** — Filter by category, level, and popularity
- 📖 **Lesson Viewer** — Read lessons with a simulated video player
- ✅ **Progress Tracking** — Mark lessons complete, track course progress
- 🧠 **Quizzes** — Take quizzes after each lesson, get instant feedback
- ⚡ **XP System** — Earn XP for enrolling, completing lessons, and quizzes
- 🏆 **Dashboard** — View your stats, enrolled courses, and quiz history
- ☁️ **Cloud Sync** — Progress saved to MongoDB (works across devices when logged in)
- 🔔 **Notifications** — In-app notification panel

---

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Hosted on **GitHub Pages**

### Backend
- **Node.js** + **Express.js**
- **JWT** for authentication
- **bcryptjs** for password hashing
- Hosted on **Render**

### Database
- **MongoDB Atlas** (Cloud)
- **Mongoose** ODM

---

## 📁 Project Structure

```
learnflow/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── js/
│   │   ├── api.js          # Backend API calls
│   │   ├── app.js          # App entry point
│   │   ├── storage.js      # State + localStorage + backend sync
│   │   ├── courses.js      # Courses page
│   │   ├── lesson.js       # Lesson page
│   │   ├── quiz.js         # Quiz page
│   │   ├── dashboard.js    # Dashboard page
│   │   ├── home.js         # Home page
│   │   ├── data.js         # Data loader
│   │   └── ui.js           # Shared UI helpers
│   └── data/
│       ├── courses.json
│       ├── lessons.json
│       └── quizzes.json
├── backend/
│   ├── server.js           # Express server entry point
│   ├── package.json
│   ├── .env                # Environment variables (not pushed to GitHub)
│   ├── middleware/
│   │   └── auth.js         # JWT auth middleware
│   └── routes/
│       ├── auth.js         # /api/auth/register, /api/auth/login
│       ├── courses.js      # /api/courses
│       └── progress.js     # /api/progress
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user, get JWT token |
| GET | `/api/auth/me` | Get current user (protected) |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/courses` | Get all courses |
| GET | `/api/courses/lessons` | Get all lessons |
| GET | `/api/courses/quizzes` | Get all quizzes |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get user progress (protected) |
| POST | `/api/progress` | Save user progress (protected) |

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/Anushri488/learnflow.git
cd learnflow/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET in .env

# Start server
npm run dev
```

### Frontend Setup
```bash
# Just open in browser
cd learnflow/frontend
# Open index.html in your browser
# OR use Live Server extension in VS Code
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learnflow
JWT_SECRET=your_secret_key_here
```

---

## 📸 Screenshots

### Home Page
> Browse featured courses and continue learning

### Courses Page
> Filter by category, level, and sort by popularity

### Lesson View
> Watch lessons and mark them complete

### Quiz
> Answer questions and earn XP

### Dashboard
> Track your progress, XP, and quiz history

---

## 🔮 Future Plans

- [ ] Google OAuth login
- [ ] Certificate generation on course completion
- [ ] Admin panel to add/edit courses
- [ ] Real video embedding (YouTube)
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

---

## 👩‍💻 Made by

**Anushri** — [GitHub](https://github.com/Anushri488)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
