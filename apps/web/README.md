# College Dakhla — Web Frontend

React 18 + Vite 8 + Tailwind CSS 3.4 frontend for the College Dakhla college admission platform.

---

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 6
- **Data Fetching:** TanStack React Query 5
- **HTTP Client:** Axios
- **Charts:** Recharts 2
- **Rich Text:** React Quill 2
- **Real-Time:** Socket.IO Client 4
- **Table:** TanStack React Table 8

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server (requires API running on port 5000)
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `http://localhost:5000` | Backend API base URL |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |

---

## Features

### Public Portal (18 pages)

| Feature | Description |
|---------|-------------|
| **Home Page** | Animated banner slideshow (admin-manageable), live search, featured colleges with sliders, news tabs, testimonials, exams, ranking table, interactive helpdesk form, newsletter subscription, AI college finder widget |
| **College Listings** | Browse/filter by state, city, course, stream, college type, fees, ranking. Sort by rating/fees/ranking |
| **College Detail** | Rich profile with about, courses & fees, admissions, eligibility, cutoffs, placements, hostel, reviews, scholarships, FAQs |
| **Course Catalog** | Browse courses organized by academic stream with eligibility and entrance exam info |
| **College Predictor** | AI-powered Safe/Target/Dream recommendations based on exam rank/score |
| **College Comparison** | Side-by-side comparison of up to 5 colleges across fees, placements, ratings |
| **ROI Calculator** | Calculate return on investment for college fees |
| **Entrance Exams** | Detailed exam info: dates, eligibility, syllabus, pattern, application links |
| **Scholarships** | Scholarship listings with provider, type, amount, eligibility, deadlines |
| **Study Materials** | Downloadable notes, sample papers, ebooks organized by stream and exam |
| **College Reviews** | Student reviews with multi-dimensional ratings and filtering |
| **Q&A Community** | Ask questions, post answers, upvote, filter by stream |
| **Admission Alerts** | Real-time alerts with bell icon in navbar, detailed alerts page |
| **Blogs** | Featured posts, category filtering, tags, SEO metadata |
| **Guided Discovery** | Quiz-style college discovery flow |
| **About Us** | Platform information |
| **Contact** | Contact form |
| **Smart AI College Finder** | Floating widget → full-screen modal with AI-powered recommendations |

### Admin Panel (25+ pages)

| Feature | Description |
|---------|-------------|
| **Real-Time Dashboard** | Live WebSocket updates, bar/area/pie charts, period filters (30D/1M/6M/1Y), CSV exports (leads/colleges/blogs), connection indicator |
| **Banner Management** | Add/edit/delete home page banners with image upload, preview, link, order, active status |
| **College Management** | Full CRUD table with search, pagination, edit/delete |
| **College Form** | Rich form with sections, SEO fields, course associations |
| **Course Management** | Full CRUD table with stream, substream, duration, eligibility |
| **Course Form** | Add/edit course details |
| **Exam Management** | Full CRUD with exam dates, eligibility, pattern, fees |
| **Blog Management** | Full CRUD with Quill rich text editor, SEO meta fields, featured posts, tags, categories |
| **Testimonial Management** | CRUD with featured and verification status |
| **Review Moderation** | Moderate reviews with approve/reject status (approving recalculates college rating) |
| **Q&A Moderation** | Manage community questions |
| **Alert Management** | CRUD alerts with type, deadline |
| **Scholarship Management** | CRUD with provider, type, amount, eligibility |
| **Study Material Management** | CRUD with download tracking |
| **Stream Management** | Master data CRUD |
| **Substream Management** | Master data CRUD |
| **Course Duration Management** | Master data CRUD |
| **API Mapping Management** | External college API endpoint mappings |
| **Lead Management** | View enquiries with auto-matched top 5 colleges, status tracking, email sending, CSV export, source filtering (home/college/contact/predictor) |

---

## Routes

### Public Routes (shared navbar + footer + AI college finder widget)

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with banner slideshow, search, featured content |
| `/colleges` | CollegeList | Browse all colleges with filters |
| `/college/:slug` | CollegeDetail | College profile with all sections |
| `/courses` | Courses | Browse courses by stream |
| `/blogs` | Blogs | Education articles & news |
| `/exams` | ExamsPage | Entrance exam listings |
| `/scholarships` | ScholarshipsPage | Scholarship listings |
| `/study-material` | StudyMaterialPage | Study resources |
| `/reviews` | ReviewsPage | College reviews |
| `/alerts` | AlertsPage | Live admission alerts |
| `/community` | CommunityPage | Q&A community |
| `/predictor` | PredictorPage | College predictor tool |
| `/compare` | CompareColleges | College comparison |
| `/roi-calculator` | RoiCalculatorPage | ROI calculator |
| `/discover` | DiscoverColleges | Guided college discovery |
| `/about` | AboutUs | About the platform |
| `/contact` | Contact | Contact form |

### Admin Routes (authenticated, sidebar + topbar layout)

| Path | Page | Description |
|------|------|-------------|
| `/admin/login` | AdminLogin | Sign-in page |
| `/admin` | AdminDashboard | Real-time analytics dashboard |
| `/admin/banners` | AdminBanners | Home page banner CRUD |
| `/admin/colleges` | AdminColleges | Manage colleges |
| `/admin/colleges/new` | AdminCollegeForm | Add college |
| `/admin/colleges/:id` | AdminCollegeForm | Edit college |
| `/admin/courses` | AdminCourses | Manage courses |
| `/admin/courses/new` | AdminCourseForm | Add course |
| `/admin/courses/:id` | AdminCourseForm | Edit course |
| `/admin/exams` | AdminExams | Manage exams |
| `/admin/exams/new` | AdminExamForm | Add exam |
| `/admin/exams/:id` | AdminExamForm | Edit exam |
| `/admin/blogs` | AdminBlogs | Manage blogs |
| `/admin/blogs/new` | AdminBlogForm | Add blog |
| `/admin/blogs/:id` | AdminBlogForm | Edit blog |
| `/admin/testimonials` | AdminTestimonials | Manage testimonials |
| `/admin/reviews` | AdminReviews | Moderate reviews |
| `/admin/questions` | AdminQuestions | Manage Q&A |
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

## Project Structure

```
apps/web/
├── public/
├── src/
│   ├── components/
│   │   ├── colleges/         # CollegeCard component
│   │   ├── forms/            # ApiForm, CollegeForm, CourseForm, LeadForm
│   │   ├── layout/           # AdminTopbar, Sidebar
│   │   └── ui/               # ChartCard, Pagination, RichTextEditor, StatCard, Table, Icons
│   ├── hooks/
│   │   └── useSocket.js      # Socket.IO React hook (connect, auth, reconnect, events)
│   ├── lib/
│   │   ├── api.js            # Axios client (60+ API functions, auto-token, 401 redirect)
│   │   └── queryClient.js    # TanStack Query client configuration
│   ├── pages/                # 43 pages (18 public + 25 admin)
│   ├── routes/
│   │   ├── AdminRoutes.jsx   # Admin layout with auth guard (sidebar + topbar)
│   │   └── PublicRoutes.jsx  # Public layout (navbar, footer, mega menu, alerts bell, goal modal)
│   ├── styles/
│   │   └── index.css         # Tailwind directives + custom utilities
│   ├── App.jsx               # Route definitions (all routes)
│   └── main.jsx              # Entry point (React Query provider, Router)
├── index.html
├── tailwind.config.js        # Custom color palette + design tokens
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## Key Components

### Built-in Shared Components

| Component | Location | Description |
|-----------|----------|-------------|
| `StatCard` | `components/ui/` | Dashboard stat card with label, value, icon, and navigation |
| `ChartCard` | `components/ui/` | Wrapper for chart components with title |
| `Pagination` | `components/ui/` | Reusable pagination component |
| `RichTextEditor` | `components/ui/` | Quill-based WYSIWYG editor |
| `Table` | `components/ui/` | TanStack React Table wrapper |
| `Icons` | `components/ui/` | Centralized SVG icon library with dynamic `Icon` component |
| `SmartLeadRecommendationSystem` | `components/` | AI-powered college recommendation form |
| `Sidebar` | `components/layout/` | Admin sidebar navigation |
| `AdminTopbar` | `components/layout/` | Admin top bar with branding |

### Custom Hooks

| Hook | Location | Description |
|------|----------|-------------|
| `useSocket` | `hooks/useSocket.js` | Socket.IO connection with auto-reconnect, JWT auth, `dashboard:update` listener |

---

## Theme & Design System

The application uses a custom design system defined in `tailwind.config.js`:

| Token | Value | Usage |
|-------|-------|-------|
| Navy/`#08162d` | Headers, footers, primary text, sidebar |
| Navy Card/`#0f2343` | Secondary backgrounds, gradients |
| Amber/`#e28a00` | CTAs, highlights, accents, search button |
| Amber Hover/`#c67900` | Button hover states |
| Admin Gold/`#bc8041` | Admin panel accent color |
| Admin Hover/`#a56f34` | Admin panel hover states |
| Mist/`#f8fafc` | Page background |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, collapsible nav |
| Tablet | 768px+ | Two columns, expanded nav |
| Desktop | 1024px+ | Full layout with mega menu |

---

## API Integration

All API calls are centralized in `src/lib/api.js` using an Axios instance with:

- **Auto JWT injection** — Reads `admin_token` from localStorage
- **401 interception** — Redirects to `/admin/login` on token expiry
- **Response helpers** — `get()`, `post()`, `put()`, `del()` wrappers
- **60+ typed functions** — Every API endpoint has a named export
- **Blob download** — `downloadAnalyticsCSV()` helper for CSV exports
- **Base URL** — Configurable via `VITE_API_BASE_URL` env var (defaults to `http://localhost:5000`)
