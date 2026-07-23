# College Dakhla — MERN Monorepo

A full-stack college admission platform — browse 25,000+ colleges, courses, exams, scholarships, and manage student enquiries through a real-time admin dashboard.

> **Built for:** College admissions management, student counselling, and educational content publishing.

---

## 🖥️ Apps

| Directory | Stack | Description |
|-----------|-------|-------------|
| [`apps/api`](./apps/api/README.md) | Node.js, Express, MongoDB, Socket.IO | RESTful API with JWT auth, real-time WebSocket updates, file uploads, and 17 data models |
| [`apps/web`](./apps/web/README.md) | React 18, Vite 8, Tailwind CSS 3.4 | Public portal (18+ pages) + Admin panel (25+ pages) with real-time dashboard |

---

## ✨ Features

### Public Portal
- **Home Page** — Animated banner slideshow (admin-manageable), search bar, featured colleges, news, testimonials
- **College Listings** — Browse, filter, and search by state, city, course, category, fees, ranking
- **College Detail** — Rich profiles with rankings, fees, placements, reviews, courses
- **Course Catalog** — Browse courses organized by academic stream
- **College Predictor** — AI-powered college recommendation based on exam rank/score (Safe/Target/Dream)
- **College Comparison** — Side-by-side comparison of up to 5 colleges
- **ROI Calculator** — Calculate return on investment for college fees
- **Entrance Exams** — Detailed exam info with deadlines, application links, and eligibility
- **Scholarships** — Scholarship listings with eligibility criteria and deadlines
- **Study Materials** — Downloadable notes, sample papers, ebooks
- **College Reviews** — Student and alumni reviews with multi-dimensional ratings
- **Q&A Community** — Ask questions, get answers, upvote discussions
- **Admission Alerts** — Real-time admission notifications with bell icon
- **Smart AI College Finder** — AI-powered recommendation modal based on student preferences
- **Goal & Location Selector** — Multi-step modal for course and city/state selection

### Admin Panel
- **Real-Time Dashboard** — Live WebSocket updates, charts (bar, pie, area), CSV exports, period filters
- **Banner Management** — Add/edit/delete home page banners with image upload and preview
- **Full CRUD Management** — Colleges, courses, exams, blogs, testimonials, reviews, alerts, scholarships, study materials, streams, substreams, course durations, API mappings
- **Lead Management** — View student enquiries with auto-matched college recommendations, status tracking, email sending, and CSV export
- **Rich Text Editor** — Quill-based editor for blog content and college descriptions
- **File Uploads** — Local storage with optional Cloudinary integration
- **Audit Trail** — Activity logging for admin actions
- **Source-filtered Leads** — Separate pages for home, college, contact, and predictor enquiries

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **npm** 9+

### Setup

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment files
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH

# 3. (Optional) Seed the database with sample data
cd apps/api && node src/seed.js

# 4. Start both apps in dev mode
cd ..
npm run dev
```

### Access

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **API Server** | http://localhost:5000 |
| **Health Check** | http://localhost:5000/api/health |
| **Admin Login** | http://localhost:5173/admin/login |

### Admin Credentials

Generate a password hash:
```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10));"
```

Set the following in `apps/api/.env`:
```
ADMIN_EMAIL=admin@collegedakhla.com
ADMIN_PASSWORD_HASH=<bcrypt-hash-from-above>
```

---

## 📦 Project Structure

```
college-dakhla/
├── apps/
│   ├── api/                  → Express + MongoDB backend
│   │   ├── src/
│   │   │   ├── config/       # DB, Cloudinary configuration
│   │   │   ├── controllers/  # 17 route handlers
│   │   │   ├── middleware/   # Auth, error handling, upload, rate limiter, cache
│   │   │   ├── models/       # 17 Mongoose schemas
│   │   │   ├── routes/       # 17 Express route definitions
│   │   │   ├── utils/        # Helpers (audit, pagination, slugify, validation, logger)
│   │   │   ├── app.js        # Express app setup
│   │   │   ├── server.js     # Entry point with Socket.IO
│   │   │   ├── socket.js     # WebSocket server (real-time updates)
│   │   │   └── seed.js       # Database seeding script
│   │   ├── uploads/          # Local file storage
│   │   └── .env.example
│   └── web/                  → React + Vite frontend
│       └── src/
│           ├── components/   # UI components (layout, forms, cards, charts)
│           ├── hooks/        # Custom hooks (useSocket)
│           ├── lib/          # API client, query config
│           ├── pages/        # 18 public + 25 admin pages
│           ├── routes/       # Public & admin route layouts
│           └── styles/       # Tailwind CSS
├── package.json              # Workspace root
└── README.md                 # This file
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API README](./apps/api/README.md) | Full API docs, models, endpoints, env vars |
| [Web README](./apps/web/README.md) | Frontend pages, components, routes, theme |

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both API and web in dev mode (concurrently) |
| `npm run dev:api` | Start API only |
| `npm run dev:web` | Start web only |
| `npm run build` | Build frontend for production |
| `npm run start` | Start API in production mode |




http://localhost:5000/api