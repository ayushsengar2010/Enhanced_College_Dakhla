# College Dakhla — API

Node.js + Express + MongoDB + Socket.IO backend for the College Dakhla college admission platform.

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose 8
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Real-Time:** Socket.IO 4 (WebSocket)
- **File Uploads:** Multer (local) / Cloudinary
- **Security:** Helmet, CORS, express-rate-limit
- **Performance:** compression, HTTP caching headers
- **Email:** Nodemailer
- **Logging:** Morgan + custom structured logger

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your MongoDB URI and secrets

# 4. Start development server
npm run dev

# 5. Or start in production
npm start
```

The API runs on `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (min 16 chars) |
| `ADMIN_EMAIL` | **Yes** | — | Email for admin login |
| `ADMIN_PASSWORD_HASH` | **Yes** | — | bcrypt hash of the admin password |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin(s), comma-separated |
| `LOG_LEVEL` | No | `info` | Logging level: debug, info, warn, error |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API secret |
| `USE_CLOUDINARY` | No | `false` | Set to `true` to enable Cloudinary uploads |
| `SMTP_HOST` | No | — | SMTP server for sending emails |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_SECURE` | No | `false` | Use TLS for SMTP |
| `SMTP_USER` | No | — | SMTP username |
| `SMTP_PASS` | No | — | SMTP password |

### Generating the Admin Password Hash

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10));"
```

---

## Database Models

| Model | Collection | Description |
|-------|-----------|-------------|
| **College** | `colleges` | Engineering/management/medical colleges with rankings, fees, placement data, sections |
| **Course** | `courses` | Course catalog under various streams with eligibility, entrance exams |
| **Stream** | `streams` | Academic streams (Engineering, Management, Medical, etc.) |
| **Substream** | `substreams` | Specializations under each stream (CSE, Finance, etc.) |
| **CourseDuration** | `coursedurations` | Duration options (1 Year, 2 Years, 3 Years, 4 Years) |
| **Exam** | `exams` | Entrance exam details (JEE, NEET, CAT, CUET, BITSAT, etc.) |
| **CollegeApi** | `collegeapis` | External API endpoint mappings for lead routing |
| **Lead** | `leads` | Student enquiries with auto-matched college recommendations |
| **Blog** | `blogs` | Education articles, exam alerts, career guidance with SEO fields |
| **Testimonial** | `testimonials` | Student success stories and reviews |
| **Review** | `reviews` | College reviews with multi-dimensional ratings (overall, placement, faculty, campus, value) |
| **Question** | `questions` | Community Q&A posts with answers, upvotes, view counting |
| **Scholarship** | `scholarships` | Scholarship listings with eligibility, type, and deadlines |
| **StudyMaterial** | `studymaterials` | Study resources (notes, sample papers, ebooks) with download tracking |
| **Alert** | `alerts` | Live admission alerts with type filtering and subscriber management |
| **AlertSubscriber** | `alertsubscribers` | Email subscribers for admission alert notifications |
| **Banner** | `banners` | Home page banner slideshow images with order, active status, and links |
| **AuditLog** | `auditlogs` | Admin activity audit trail with fallback file logging |

---

## API Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | — | Server health, MongoDB status, uptime |
| `GET` | `/api/ready` | — | Readiness probe for deployment checks; returns 503 until MongoDB is connected |

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Admin login (returns JWT token, 7-day expiry) |

### Colleges

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/colleges` | Optional | List colleges (pagination, search, filter by state/city/course/fees/ranking) |
| `GET` | `/api/colleges/slug/:slug` | — | Get college by slug |
| `GET` | `/api/colleges/:id` | — | Get college by ID |
| `GET` | `/api/colleges/compare?ids=id1,id2` | — | Compare up to 5 colleges |
| `POST` | `/api/colleges` | Admin | Create college |
| `PUT` | `/api/colleges/:id` | Admin | Update college |
| `DELETE` | `/api/colleges/:id` | Admin | Soft-delete college |

### Courses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/courses` | — | List courses (pagination, search) |
| `POST` | `/api/courses` | Admin | Create course |
| `PUT` | `/api/courses/:id` | Admin | Update course |
| `DELETE` | `/api/courses/:id` | Admin | Soft-delete course |

### Masters (Streams, Substreams, Durations)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/masters/streams` | Admin | List streams |
| `POST` | `/api/masters/streams` | Admin | Create stream |
| `PUT` | `/api/masters/streams/:id` | Admin | Update stream |
| `DELETE` | `/api/masters/streams/:id` | Admin | Soft-delete stream |
| `GET` | `/api/masters/substreams` | Admin | List substreams |
| `POST` | `/api/masters/substreams` | Admin | Create substream |
| `PUT` | `/api/masters/substreams/:id` | Admin | Update substream |
| `DELETE` | `/api/masters/substreams/:id` | Admin | Soft-delete substream |
| `GET` | `/api/masters/durations` | Admin | List course durations |
| `POST` | `/api/masters/durations` | Admin | Create duration |
| `PUT` | `/api/masters/durations/:id` | Admin | Update duration |
| `DELETE` | `/api/masters/durations/:id` | Admin | Soft-delete duration |

### College APIs (External Mappings)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/college-apis` | Admin | List API mappings |
| `POST` | `/api/college-apis` | Admin | Create API mapping |
| `PUT` | `/api/college-apis/:id` | Admin | Update API mapping |
| `DELETE` | `/api/college-apis/:id` | Admin | Soft-delete API mapping |

### Leads & Enquiries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/leads` | Admin | List leads (filter by status, source, city, search) |
| `POST` | `/api/leads` | — | Create lead (public) with auto-matched top 5 colleges |
| `PUT` | `/api/leads/:id` | Admin | Update lead status & remarks |
| `DELETE` | `/api/leads/:id` | Admin | Delete lead |
| `POST` | `/api/leads/:id/email` | Admin | Send email to lead via SMTP |
| `GET` | `/api/leads/export/csv` | Admin | Export leads as CSV |

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/blogs` | Optional | List blogs (filter by category, tag, search; pagination) |
| `GET` | `/api/blogs/featured` | — | Get featured posts |
| `GET` | `/api/blogs/categories` | — | Get unique blog categories |
| `GET` | `/api/blogs/slug/:slug` | Optional | Get blog by slug |
| `GET` | `/api/blogs/:id` | Admin | Get blog by ID |
| `POST` | `/api/blogs` | Admin | Create blog |
| `PUT` | `/api/blogs/:id` | Admin | Update blog |
| `DELETE` | `/api/blogs/:id` | Admin | Soft-delete blog |

### Testimonials

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/testimonials` | Optional | List testimonials |
| `POST` | `/api/testimonials` | Admin | Create testimonial |
| `PUT` | `/api/testimonials/:id` | Admin | Update testimonial |
| `DELETE` | `/api/testimonials/:id` | Admin | Soft-delete testimonial |

### Exams

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/exams` | — | List exams (filter by stream, search) |
| `GET` | `/api/exams/:id` | — | Get exam by ID |
| `POST` | `/api/exams` | Admin | Create exam |
| `PUT` | `/api/exams/:id` | Admin | Update exam |
| `DELETE` | `/api/exams/:id` | Admin | Soft-delete exam |

### Scholarships

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/scholarships` | Optional | List scholarships (filter by type, stream) |
| `GET` | `/api/scholarships/:id` | — | Get scholarship by ID |
| `POST` | `/api/scholarships` | Admin | Create scholarship |
| `PUT` | `/api/scholarships/:id` | Admin | Update scholarship |
| `DELETE` | `/api/scholarships/:id` | Admin | Soft-delete scholarship |

### Study Materials

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/study-materials` | — | List study materials (filter by stream, type, exam) |
| `GET` | `/api/study-materials/:id` | — | Get study material by ID (increments download count) |
| `POST` | `/api/study-materials` | Admin | Create study material |
| `PUT` | `/api/study-materials/:id` | Admin | Update study material |
| `DELETE` | `/api/study-materials/:id` | Admin | Soft-delete study material |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reviews` | Optional | List reviews (filter by college, status) |
| `POST` | `/api/reviews` | — | Submit a review |
| `PUT` | `/api/reviews/:id` | Admin | Update review (approving recalculates college rating) |
| `DELETE` | `/api/reviews/:id` | Admin | Soft-delete review |

### Questions (Q&A)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/questions` | — | List questions (filter by stream, status, search) |
| `GET` | `/api/questions/:id` | — | Get question by ID (increments view count) |
| `POST` | `/api/questions` | — | Ask a question |
| `POST` | `/api/questions/:id/answers` | — | Submit an answer |
| `POST` | `/api/questions/:id/upvote` | — | Upvote a question |
| `DELETE` | `/api/questions/:id` | Admin | Soft-delete question |

### Banners

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/banners` | Optional | List banners (public sees active only) |
| `POST` | `/api/banners` | Admin | Create banner |
| `PUT` | `/api/banners/:id` | Admin | Update banner |
| `DELETE` | `/api/banners/:id` | Admin | Delete banner |

### Alerts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/alerts` | Optional | List alerts (filter by type, stream) |
| `POST` | `/api/alerts` | Admin | Create alert |
| `PUT` | `/api/alerts/:id` | Admin | Update alert |
| `DELETE` | `/api/alerts/:id` | Admin | Soft-delete alert |
| `POST` | `/api/alerts/subscribe` | — | Subscribe to alerts (upsert by email) |
| `GET` | `/api/alerts/subscribers/all` | Admin | List active subscribers |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/analytics/dashboard` | Admin | Full dashboard stats (totals, trends, breakdowns, recent leads, top colleges) |
| `GET` | `/api/analytics/export/csv?type=leads\|colleges\|blogs` | Admin | Export analytics as CSV |

### Uploads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/uploads` | Admin | Upload file (image jpeg/png/webp or PDF, max 8MB) — local or Cloudinary |

---

## 🔌 Real-Time WebSocket Events

The API uses Socket.IO for real-time communication.

### Connection

```js
const socket = io("http://localhost:5000", {
  auth: { token: "<admin-jwt-token>" }
});
```

### Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `dashboard:update` | Server → Client | `{ type, entity, action, bannerId, timestamp }` | Emitted when data changes (lead created/updated, banner changes) |
| `notification` | Server → Client | `{ message, type, timestamp }` | Toast-style admin notifications |

### Helper Functions

```js
const { initSocket, emitDashboardUpdate, emitNotification } = require("./socket");
```

- `initSocket(httpServer)` — Attach Socket.IO to HTTP server
- `emitDashboardUpdate(payload)` — Broadcast to all admin clients
- `emitNotification(message, type)` — Send notification to admin clients

---

## 🔐 Authentication

All admin-protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt-token>
```

Two middleware variants:
- **`requireAuth`** — Rejects unauthenticated requests with 401. Verifies admin role (403 if not admin).
- **`optionalAuth`** — Allows requests without a token (sets `req.user = null`).

Token expiry: **7 days**.

---

## 🔒 Security Features

- **Helmet** — Security headers (CSP, XSS, etc.)
- **Rate Limiting** — 60 req/min general API, 10 req/15min auth, 10 req/15min lead creation
- **Input Validation** — XSS prevention via HTML stripping, regex injection prevention
- **CORS** — Configurable origins
- **Soft Deletes** — All entities use `isDeleted` flag instead of hard deletion
- **CSV Export** — Proper field escaping to prevent injection

---

## 🗄️ Seed Data

Run the seed script to populate the database with comprehensive sample data:

```bash
node src/seed.js
```

### Seeds

| Entity | Count | Details |
|--------|-------|---------|
| Streams | 10 | Engineering, Management, Medical, Commerce, etc. |
| Substreams | 20 | CSE, AI/DS, Finance, Marketing, MBBS, etc. |
| Course Durations | 4 | 1, 2, 3, 4 Year |
| Courses | 20 | B.Tech CSE, MBA, MBBS, B.Des, etc. |
| Colleges | 30+ | IIT Bombay, IIT Delhi, IIT Kanpur, BHU, DTU, etc. across UP, Delhi, Maharashtra, Karnataka, Haryana, Rajasthan |
| Exams | 6 | JEE Main, JEE Advanced, NEET, CAT, CUET, BITSAT |
| Blogs | 5 | Exam alerts, career guidance, admission news |
| Reviews | 4 | College reviews with ratings |
| Scholarships | 4 | Reliance, UP Scholarship, MHRD, HDFC |
| Study Materials | 4 | JEE, NEET, CAT, CUET resources |
| Testimonials | 4 | Student success stories |
| Questions | 3 | Community Q&A with answers |
| Alerts | 5 | Live admission alerts |

---

## 🏗️ Project Structure

```
apps/api/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controllers/           # 17 route handlers
│   │   ├── authController.js
│   │   ├── collegeController.js
│   │   ├── courseController.js
│   │   ├── leadController.js
│   │   ├── blogController.js
│   │   ├── bannerController.js
│   │   ├── examController.js
│   │   ├── reviewController.js
│   │   ├── alertController.js
│   │   ├── ... (17 total)
│   ├── middleware/
│   │   ├── auth.js            # JWT auth (requireAuth, optionalAuth)
│   │   ├── cache.js           # Cache-control headers
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── rateLimiter.js     # Rate limiting
│   │   └── upload.js          # Multer file upload config
│   ├── models/                # 17 Mongoose schemas
│   ├── routes/                # 17 Express route files
│   ├── utils/
│   │   ├── audit.js           # Audit logging with MongoDB + fallback file
│   │   ├── logger.js          # Structured logging utility
│   │   ├── pagination.js      # Pagination parser
│   │   ├── slugify.js         # URL slug generator
│   │   └── validation.js      # Input sanitization, regex, email/phone validation
│   ├── app.js                 # Express app setup (middleware, routes, error handling)
│   ├── server.js              # Entry point (env validation, DB connect, HTTP + Socket.IO)
│   ├── socket.js              # Socket.IO server with JWT auth
│   └── seed.js                # Database seeding script
├── uploads/                   # Local file uploads directory
├── .env.example               # Environment template
└── package.json
```
