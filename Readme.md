# Day 0 - Full-Stack MERN Application

A modern full-stack web application featuring an Express/MongoDB backend with JWT authentication and a React frontend built with Vite, TypeScript, Tailwind CSS, and shadcn/ui.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui & Lucide Icons

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js

---

## 📁 Project Structure

```text
DAY 0/
├── backend/               # Express API server
│   ├── src/
│   │   ├── config/        # Database setup
│   │   ├── controllers/   # Request handlers & logic
│   │   ├── middlewares/   # Auth & error handling
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routes/        # API route definitions
│   │   └── services/      # Business logic & JWT utilities
│   └── server.js
│
└── frontend/              # Vite + React app
    ├── src/
    │   ├── assets/        # Media and static files
    │   ├── components/    # Reusable UI & Layout components
    │   ├── hooks/         # Custom React hooks
    │   ├── pages/         # Application pages
    │   └── routes/        # Frontend routing
    └── vite.config.ts

git status
git add .
git commit -m "your update message"
git push