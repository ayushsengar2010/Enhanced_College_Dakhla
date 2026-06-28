# College Dakhla — Web Frontend

React + Vite + Tailwind CSS frontend for the College Dakhla college admission platform.

---

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 6
- **Data Fetching:** TanStack React Query 5
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Rich Text:** React Quill 2

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your API base URL
#    VITE_API_BASE_URL=http://localhost:5000

# 4. Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:5000` | Backend API base URL |

---

## Project Structure

```
apps/web/
├── public/
├── src/
│   ├── components/
│   │   ├── colleges/         # CollegeCard component
│   │   ├── forms/            # Form components (ApiForm, CollegeForm, CourseForm, LeadForm)
│   │   ├── layout/           # AdminTopbar, Sidebar
│   │   └── ui/               # Reusable UI components (ChartCard, Pagination, RichTextEditor, StatCard, Table)
│   ├── lib/
│   │   ├── api.js            # Axios client with all API functions
│   │   └── queryClient.js    # TanStack Query client config
│   ├── pages/
│   │   ├── Admin*.jsx        # 25 admin pages (dashboard, CRUD forms, listings)
│   │   └── Public*.jsx       # 18 public pages (home, colleges, courses, blogs, etc.)
│   ├── routes/
│   │   ├── AdminRoutes.jsx   # Admin layout with auth guard
│   │   └── PublicRoutes.jsx  # Public layout with navbar & footer
│   ├── styles/
│   │   └── index.css         # Tailwind imports & custom CSS
│   ├── App.jsx               # Route definitions
│   └── main.jsx              # Entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## Routes

### Public Routes (with shared navbar & footer)

| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page with featured colleges |
| `/colleges` | CollegeList | Browse all colleges with filters |
| `/college/:slug` | CollegeDetail | College profile with details |
| `/courses` | Courses | Browse courses by stream |
| `/blogs` | Blogs | Education articles & news |
| `/blogs/:id` | Blogs | Single blog post |
| `/exams` | ExamsPage | Entrance exam listings |
| `/scholarships` | ScholarshipsPage | Scholarship listings |
| `/study-material` | StudyMaterialPage | Study resources |
| `/reviews` | ReviewsPage | College reviews |
| `/alerts` | AlertsPage | Live admission alerts |
| `/community` | CommunityPage | Q&A community |
| `/predictor` | PredictorPage | College predictor tool |
| `/compare` | CompareColleges | College comparison tool |
| `/roi-calculator` | RoiCalculatorPage | ROI calculator |
| `/discover` | DiscoverColleges | Guided college discovery |
| `/about` | AboutUs | About the platform |
| `/contact` | Contact | Contact form |

### Admin Routes (authenticated, with sidebar & topbar)

| Path | Page | Description |
|---|---|---|
| `/admin/login` | AdminLogin | Admin sign-in page |
| `/admin` | AdminDashboard | Dashboard with analytics |
| `/admin/colleges` | AdminColleges | Manage colleges |
| `/admin/colleges/new` | AdminCollegeForm | Add college |
| `/admin/colleges/:id` | AdminCollegeForm | Edit college |
| `/admin/courses` | AdminCourses | Manage courses |
| `/admin/courses/new` | AdminCourseForm | Add course |
| `/admin/courses/:id` | AdminCourseForm | Edit course |
| `/admin/exams` | AdminExams | Manage exams |
| `/admin/blogs` | AdminBlogs | Manage blogs |
| `/admin/testimonials` | AdminTestimonials | Manage testimonials |
| `/admin/reviews` | AdminReviews | Moderate reviews |
| `/admin/alerts` | AdminAlerts | Manage alerts |
| `/admin/scholarships` | AdminScholarships | Manage scholarships |
| `/admin/study-material` | AdminStudyMaterials | Manage study materials |
| `/admin/streams` | AdminStreams | Manage streams |
| `/admin/substreams` | AdminSubstreams | Manage substreams |
| `/admin/course-durations` | AdminCourseDurations | Manage durations |
| `/admin/apis` | AdminApis | Manage API mappings |
| `/admin/leads` | AdminLeads | All enquiries |
| `/admin/leads/home` | AdminHomeEnquiries | Home page enquiries |
| `/admin/leads/college` | AdminCollegeEnquiries | College-specific enquiries |
| `/admin/leads/contact` | AdminContactEnquiries | Contact form enquiries |
| `/admin/leads/predictor` | AdminPredictorEnquiries | Predictor tool enquiries |

---

## Features

### Public Portal
- **College Listings** — Browse, filter, and search colleges by state, city, course, and category
- **College Detail** — Rich profile pages with rankings, fees, placements, and reviews
- **Course Catalog** — Browse courses organized by academic stream
- **College Predictor** — AI-powered college recommendation based on exam scores
- **College Comparison** — Side-by-side comparison of multiple colleges
- **ROI Calculator** — Calculate return on investment for college fees
- **Entrance Exams** — Detailed exam information with deadlines and application links
- **Scholarships** — Scholarship listings with eligibility criteria
- **Study Materials** — Downloadable notes, sample papers, and ebooks
- **College Reviews** — Student and alumni reviews with ratings
- **Q&A Community** — Ask questions and get answers from the community
- **Admission Alerts** — Real-time admission notifications
- **Smart AI College Finder** — AI-powered recommendation based on student preferences

### Admin Panel
- **Dashboard** — Analytics with charts and stats (total colleges, courses, leads, etc.)
- **CRUD Management** — Full CRUD for all entities (colleges, courses, exams, blogs, etc.)
- **Lead Management** — View and manage student enquiries with source filtering
- **Rich Text Editor** — Quill-based editor for college descriptions and blog content
- **File Uploads** — Image uploads with Cloudinary support
- **Audit Trail** — Activity logging for admin actions

---

## Theme

The application uses a custom design system:

| Token | Value | Usage |
|---|---|---|
| Navy | `#08162d` | Headers, footers, primary text |
| Navy Card | `#0f2343` | Secondary backgrounds, gradients |
| Amber | `#e28a00` | CTAs, highlights, accents |
| Amber Hover | `#c67900` | Button hover states |
| Admin Gold | `#bc8041` | Admin panel accent |
| Admin Hover | `#a56f34` | Admin panel hover |
| Mist | `#f8fafc` | Page background |

See `tailwind.config.js` for the full color palette and design tokens.

---

## Screenshots

Below is a visual overview of the application. Add screenshots to `screenshots/` and update the image paths accordingly.

> **Note:** To generate these screenshots, start the app (`npm run dev`) and use your browser's built-in screenshot tool or a browser extension. The app runs on `http://localhost:5173`.

### Public Portal

| Page | Preview |
|------|---------|
| **Home Page** — Hero banner, featured colleges, and quick links | ![Home Page](./screenshots/home.png) |
| **College Listings** — Browse with filters by state, city, course | ![College List](./screenshots/college-list.png) |
| **College Detail** — Rankings, fees, placements, reviews | ![College Detail](./screenshots/college-detail.png) |
| **Courses** — Course catalog organized by academic stream | ![Courses](./screenshots/courses.png) |
| **College Predictor** — AI-powered recommendation tool | ![Predictor](./screenshots/predictor.png) |
| **College Comparison** — Side-by-side college comparison | ![Compare](./screenshots/compare.png) |
| **Blogs** — Education articles and exam alerts | ![Blogs](./screenshots/blogs.png) |
| **Exams** — Entrance exam details and deadlines | ![Exams](./screenshots/exams.png) |
| **Scholarships** — Scholarship listings with eligibility | ![Scholarships](./screenshots/scholarships.png) |
| **Reviews** — Student and alumni reviews | ![Reviews](./screenshots/reviews.png) |
| **Admission Alerts** — Real-time notifications | ![Alerts](./screenshots/alerts.png) |
| **Q&A Community** — Ask questions and get answers | ![Community](./screenshots/community.png) |

### Admin Panel

| Page | Preview |
|------|---------|
| **Admin Login** — Sign-in page with credentials | ![Admin Login](./screenshots/admin-login.png) |
| **Dashboard** — Analytics with charts and stats | ![Dashboard](./screenshots/admin-dashboard.png) |
| **College Management** — CRUD table for colleges | ![Admin Colleges](./screenshots/admin-colleges.png) |
| **College Form** — Add/edit college details | ![Admin College Form](./screenshots/admin-college-form.png) |
| **Course Management** — Manage course catalog | ![Admin Courses](./screenshots/admin-courses.png) |
| **Lead Enquiries** — View and manage student leads | ![Admin Leads](./screenshots/admin-leads.png) |
| **Blog Management** — Create and edit blog posts | ![Admin Blogs](./screenshots/admin-blogs.png) |
| **Streams & Substreams** — Master data management | ![Admin Streams](./screenshots/admin-streams.png) |

---

## API Integration

All API calls are centralized in `src/lib/api.js` using an Axios instance with:

- Automatic JWT token injection from localStorage
- 401 response interceptor (redirects to login on expired tokens)
- Request/response helpers (`get`, `post`, `put`, `del`)
- Typed functions for every API endpoint
