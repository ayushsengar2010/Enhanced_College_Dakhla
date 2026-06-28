# College Dakhla — API

Node.js + Express + MongoDB backend for the College Dakhla admission platform.

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose 8
- **Auth:** JWT (jsonwebtoken)
- **File Uploads:** Multer (local) / Cloudinary
- **Security:** Helmet, CORS
- **Email:** Nodemailer
- **Validation:** Mongoose schema validation

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your MongoDB URI and secrets
#    (see Environment Variables section below)

# 4. Start development server (with nodemon)
npm run dev

# 5. Or start in production
npm start
```

The API runs on `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing |
| `ADMIN_EMAIL` | **Yes** | — | Email for admin login |
| `ADMIN_PASSWORD_HASH` | **Yes** | — | bcrypt hash of the admin password |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API secret |
| `USE_CLOUDINARY` | No | `false` | Set to `true` to enable Cloudinary uploads |

### Generating the Admin Password Hash

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourPassword', 10));"
```

---

## Database Models

| Model | Collection | Description |
|---|---|---|
| **College** | `colleges` | Engineering/management/medical colleges with rankings, fees, placement data |
| **Course** | `courses` | Course catalog under various streams |
| **Stream** | `streams` | Academic streams (Engineering, Management, Medical, etc.) |
| **Substream** | `substreams` | Specializations under each stream (CSE, Finance, etc.) |
| **CourseDuration** | `coursedurations` | Duration options (1 Year, 2 Years, 3 Years, 4 Years) |
| **Exam** | `exams` | Entrance exam details (JEE, NEET, CAT, CUET, etc.) |
| **CollegeApi** | `collegeapis` | External API endpoint mappings for lead routing |
| **Lead** | `leads` | Student enquiries and admission leads |
| **Blog** | `blogs` | Education articles, exam alerts, career guidance |
| **Testimonial** | `testimonials` | Student success stories and reviews |
| **Review** | `reviews` | College reviews from students/alumni |
| **Question** | `questions` | Community Q&A posts with answers and upvotes |
| **Scholarship** | `scholarships` | Scholarship listings with eligibility and deadlines |
| **StudyMaterial** | `studymaterials` | Study resources (notes, sample papers, ebooks) |
| **Alert** | `alerts` | Live admission alerts and notifications |
| **AuditLog** | `auditlogs` | Admin activity audit trail |

---

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health status |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Admin login (returns JWT token) |

### Colleges

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/colleges` | — | List colleges (with pagination, filters) |
| `GET` | `/api/colleges/slug/:slug` | — | Get college by slug |
| `GET` | `/api/colleges/:id` | — | Get college by ID |
| `POST` | `/api/colleges` | Admin | Create college |
| `PUT` | `/api/colleges/:id` | Admin | Update college |
| `DELETE` | `/api/colleges/:id` | Admin | Delete college |

### Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses` | — | List courses (with filters) |
| `POST` | `/api/courses` | Admin | Create course |
| `PUT` | `/api/courses/:id` | Admin | Update course |
| `DELETE` | `/api/courses/:id` | Admin | Delete course |

### Masters (Streams, Substreams, Durations)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/masters/streams` | Admin | List streams |
| `POST` | `/api/masters/streams` | Admin | Create stream |
| `PUT` | `/api/masters/streams/:id` | Admin | Update stream |
| `DELETE` | `/api/masters/streams/:id` | Admin | Delete stream |
| `GET` | `/api/masters/substreams` | Admin | List substreams |
| `POST` | `/api/masters/substreams` | Admin | Create substream |
| `PUT` | `/api/masters/substreams/:id` | Admin | Update substream |
| `DELETE` | `/api/masters/substreams/:id` | Admin | Delete substream |
| `GET` | `/api/masters/durations` | Admin | List course durations |
| `POST` | `/api/masters/durations` | Admin | Create duration |
| `PUT` | `/api/masters/durations/:id` | Admin | Update duration |
| `DELETE` | `/api/masters/durations/:id` | Admin | Delete duration |

### College APIs (External Mappings)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/college-apis` | Admin | List API mappings |
| `POST` | `/api/college-apis` | Admin | Create API mapping |
| `PUT` | `/api/college-apis/:id` | Admin | Update API mapping |
| `DELETE` | `/api/college-apis/:id` | Admin | Delete API mapping |

### Leads & Enquiries

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/leads` | Admin | List leads (with filters by source) |
| `POST` | `/api/leads` | — | Create lead (public) |
| `PUT` | `/api/leads/:id` | Admin | Update lead |
| `DELETE` | `/api/leads/:id` | Admin | Delete lead |
| `POST` | `/api/leads/:id/email` | Admin | Send email to lead |

### Blogs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/blogs` | — | List blogs |
| `GET` | `/api/blogs/slug/:slug` | — | Get blog by slug |
| `GET` | `/api/blogs/:id` | — | Get blog by ID |
| `POST` | `/api/blogs` | Admin | Create blog |
| `PUT` | `/api/blogs/:id` | Admin | Update blog |
| `DELETE` | `/api/blogs/:id` | Admin | Delete blog |

### Testimonials

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/testimonials` | — | List testimonials |
| `POST` | `/api/testimonials` | Admin | Create testimonial |
| `PUT` | `/api/testimonials/:id` | Admin | Update testimonial |
| `DELETE` | `/api/testimonials/:id` | Admin | Delete testimonial |

### Exams

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/exams` | — | List exams |
| `GET` | `/api/exams/:id` | — | Get exam by ID |
| `POST` | `/api/exams` | Admin | Create exam |
| `PUT` | `/api/exams/:id` | Admin | Update exam |
| `DELETE` | `/api/exams/:id` | Admin | Delete exam |

### Scholarships

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/scholarships` | — | List scholarships |
| `GET` | `/api/scholarships/:id` | — | Get scholarship by ID |
| `POST` | `/api/scholarships` | Admin | Create scholarship |
| `PUT` | `/api/scholarships/:id` | Admin | Update scholarship |
| `DELETE` | `/api/scholarships/:id` | Admin | Delete scholarship |

### Study Materials

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/study-materials` | — | List study materials |
| `GET` | `/api/study-materials/:id` | — | Get study material by ID |
| `POST` | `/api/study-materials` | Admin | Create study material |
| `PUT` | `/api/study-materials/:id` | Admin | Update study material |
| `DELETE` | `/api/study-materials/:id` | Admin | Delete study material |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | — | List reviews |
| `POST` | `/api/reviews` | — | Submit a review |
| `PUT` | `/api/reviews/:id` | Admin | Update review |
| `DELETE` | `/api/reviews/:id` | Admin | Delete review |

### Questions (Q&A)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/questions` | — | List questions |
| `GET` | `/api/questions/:id` | — | Get question by ID |
| `POST` | `/api/questions` | — | Ask a question |
| `POST` | `/api/questions/:id/answers` | — | Submit an answer |
| `POST` | `/api/questions/:id/upvote` | — | Upvote a question |
| `DELETE` | `/api/questions/:id` | Admin | Delete question |

### Alerts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/alerts` | — | List alerts |
| `POST` | `/api/alerts` | Admin | Create alert |
| `PUT` | `/api/alerts/:id` | Admin | Update alert |
| `DELETE` | `/api/alerts/:id` | Admin | Delete alert |
| `POST` | `/api/alerts/subscribe` | — | Subscribe to alerts |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Admin | Dashboard statistics |

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/uploads` | Admin | Upload file (local or Cloudinary) |

---

## Authentication

All admin-protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The token is obtained from `POST /api/auth/login` with valid admin credentials.

Two middleware variants:
- **`requireAuth`** — Rejects unauthenticated requests with 401
- **`optionalAuth`** — Allows requests without a token (sets `req.user = null`)

---

## Seed Data

Run the seed script to populate the database with sample data:

```bash
node src/seed.js
```

This seeds:
- 10 academic streams
- 20 substreams
- 4 course durations
- 20 courses
- 30+ colleges across UP, Delhi NCR, Maharashtra, Karnataka, Haryana, Rajasthan
- 6 entrance exams
- 5 blogs
- 5 live alerts
- 5 college reviews
- 4 scholarships
- 4 study materials
- 4 testimonials

---

## Project Structure

```
apps/api/
├── src/
│   ├── config/          # Database & Cloudinary configuration
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/     # Route handlers (17 controllers)
│   ├── middleware/       # Auth, error handling, file uploads
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/          # Mongoose schemas (16 models)
│   ├── routes/          # Express route definitions (17 route files)
│   ├── utils/           # Helpers (audit, pagination, slugify)
│   ├── app.js           # Express app setup
│   ├── seed.js          # Database seeding script
│   └── server.js        # Entry point
├── uploads/             # Local file uploads directory
├── .env.example
└── package.json
```
