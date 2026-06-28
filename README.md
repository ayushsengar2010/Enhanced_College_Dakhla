# College Dakhla (MERN Monorepo)

A full-stack college admission platform — browse colleges, courses, exams, scholarships, and manage leads through an admin panel.

---

## Apps

| Directory | Stack | Description |
|---|---|---|
| [`apps/api`](./apps/api/README.md) | Node.js, Express, MongoDB | RESTful API with JWT auth, file uploads, and 16 data models |
| [`apps/web`](./apps/web/README.md) | React, Vite, Tailwind CSS | Public portal + admin panel with 40+ pages |

---

## Quick Start

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit apps/api/.env with your MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH

# 3. Start both apps in dev mode
npm run dev
```

- **API:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`

---

## Admin Login

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (bcrypt) in `apps/api/.env`
2. Visit `http://localhost:5173/admin/login`
3. Sign in with your credentials

Generate a password hash:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10));"
```

---

## Seed Database

```bash
cd apps/api && node src/seed.js
```

Populates the database with 30+ colleges, 20 courses, 6 exams, blogs, reviews, alerts, scholarships, and study materials.

---

## Project Structure

```
college-dakhla/
├── apps/
│   ├── api/          → Express backend (README → apps/api/README.md)
│   └── web/          → React frontend (README → apps/web/README.md)
├── package.json      → Workspace root
└── README.md         → This file
```
