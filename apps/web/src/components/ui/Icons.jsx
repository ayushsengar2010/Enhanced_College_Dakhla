/* ═══════════════════════════════════════════════════════════════════
   Centralized SVG Icons Library
   All SVG icons in one place — reuse everywhere
   ═══════════════════════════════════════════════════════════════════ */

const createIcon = (viewBox = "0 0 24 24", children) => {
  const Component = ({ className = "w-4 h-4", strokeWidth = "2" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox={viewBox} strokeWidth={strokeWidth}>
      {children}
    </svg>
  );
  Component.displayName = "Icon";
  return Component;
};

/* ── Navigation & UI ───────────────────────────────────────────── */
export const ChevronDown = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
);

export const ChevronRight = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
);

export const MenuIcon = createIcon("0 0 24 24",
  <><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></>
);

export const CloseIcon = createIcon("0 0 24 24",
  <><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></>
);

export const SearchIcon = createIcon("0 0 24 24",
  <><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></>
);

export const ArrowRight = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
);

export const ArrowRightCircle = createIcon("0 0 24 24",
  <><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8l4 4m0 0l-4 4m4-4H8" /></>
);

/* ── Actions & Social ──────────────────────────────────────────── */
export const BellIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
);

export const UserIcon = createIcon("0 0 24 24",
  <><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>
);

export const StarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={`${className} text-amber-400 fill-current`} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const ReviewIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
);

export const CheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={`${className} text-emerald-500 shrink-0`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const SendIcon = createIcon("0 0 24 24",
  <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>
);

/* ── Contact / Location ────────────────────────────────────────── */
export const LocationIcon = createIcon("0 0 24 24",
  <><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></>
);

export const PhoneIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
);

export const MailIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
);

/* ── Academic / Module Icons ───────────────────────────────────── */
export const AcademicIcon = createIcon("0 0 24 24",
  <><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></>
);

export const BuildingIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-9a2 2 0 012-2h2a2 2 0 012 2v9m-4 0h4" />
);

export const CalendarIcon = createIcon("0 0 24 24",
  <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>
);

export const ClockIcon = createIcon("0 0 24 24",
  <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 16 14" /></>
);

export const TargetIcon = createIcon("0 0 24 24",
  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="3" /></>
);

export const RobotIcon = createIcon("0 0 24 24",
  <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="8.5" cy="15.5" r="1.5" /><circle cx="15.5" cy="15.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v4m-4-7h8" /></>
);

export const ScaleIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-4 9 4M3 6v10a2 2 0 002 2h14a2 2 0 002-2V6M3 6l9 6 9-6" />
);

export const NewsIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h6" />
);

export const QuestionIcon = createIcon("0 0 24 24",
  <><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01" /></>
);

export const BookIcon = createIcon("0 0 24 24",
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
);

/* ── Named icon map for dynamic lookup ─────────────────────────── */
export const Icons = {
  chart: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  ),
  blog: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h6" />
  ),
  pie: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
  ),
  activity: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  ),
  star: ({ className = "w-4 h-4" }) => (
    <svg className={`${className} text-amber-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  download: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  ),
  refresh: createIcon("0 0 24 24",
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
  ),
};

/**
 * Dynamic Icon component — renders an icon by name from the `Icons` map.
 * Usage: <Icon name="chart" className="w-5 h-5" />
 */
export const Icon = ({ name, className, strokeWidth }) => {
  const Component = Icons[name];
  if (!Component) return null;
  return <Component className={className} strokeWidth={strokeWidth} />;
};
