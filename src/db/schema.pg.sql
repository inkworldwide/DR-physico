-- PhysioEdvance — Database Schema
-- One-stop platform for physiotherapy students: subject pages, digital library (LMS),
-- live classes (Zoom), research desk, blog, and SMS notifications.


-- ========================================
-- USERS (students, instructors, admins)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    plain_password TEXT,
    user_code TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('superadmin', 'admin', 'instructor', 'student', 'intern', 'clinician', 'educator', 'researcher', 'user')),
    avatar TEXT DEFAULT '/images/users/default-avatar.png',
    face_descriptor TEXT DEFAULT NULL,  -- JSON array of 128 floats from face-api.js
    phone TEXT,
    bio TEXT,
    headline TEXT,                 -- instructor headline e.g. "MPT (Neuro), Certified Physiotherapist"
    qualification TEXT,            -- e.g. "BPT, MPT"
    is_active INTEGER DEFAULT 1,
    email_verified INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CATEGORIES (= Subjects, year-wise per the proposal's curriculum)
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'ri-pulse-line',
    description TEXT,
    year INTEGER,              -- 1-4 for year-wise subjects, NULL for "Other Subjects"
    is_other_subject INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- COURSES
-- ========================================
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    description TEXT,
    thumbnail TEXT DEFAULT '/images/courses/default-course.jpg',
    category_id INTEGER,
    instructor_id INTEGER NOT NULL,
    level TEXT DEFAULT 'Beginner' CHECK(level IN ('Beginner', 'Intermediate', 'Advanced')),
    language TEXT DEFAULT 'English',
    price REAL DEFAULT 0,
    discount_price REAL,
    duration_hours REAL DEFAULT 0,
    target_exam TEXT,                -- e.g. 'BPT 1st Year', 'BPT 2nd Year', 'MPT', 'Other Subjects'
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    is_featured INTEGER DEFAULT 0,
    rating_avg REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    requirements TEXT,                -- newline separated
    learning_outcomes TEXT,           -- newline separated "what you'll learn"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- MODULES (sections within a course)
-- ========================================
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- QUIZZES
-- ========================================
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 30,
    pass_percentage INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- LESSONS (video lectures, articles, notes within modules)
-- ========================================
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'video' CHECK(type IN ('video', 'article', 'pdf', 'quiz')),
    video_url TEXT,
    content TEXT,                 -- article/notes HTML content
    duration_minutes INTEGER DEFAULT 0,
    position INTEGER DEFAULT 0,
    is_preview INTEGER DEFAULT 0,  -- free preview lesson
    quiz_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL
);

-- ========================================
-- QUIZ QUESTIONS
-- ========================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK(correct_option IN ('a','b','c','d')),
    explanation TEXT,
    position INTEGER DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ========================================
-- ENROLLMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    progress_percent REAL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed')),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- LESSON PROGRESS
-- ========================================
CREATE TABLE IF NOT EXISTS lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    is_completed INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- QUIZ ATTEMPTS
-- ========================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    score REAL DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    passed INTEGER DEFAULT 0,
    answers_json TEXT,            -- JSON snapshot of selected answers
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ========================================
-- REVIEWS / RATINGS
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- ORDERS / PAYMENTS (mock gateway, real flow)
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'mock_gateway',
    transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- CERTIFICATES
-- ========================================
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    certificate_code TEXT UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ========================================
-- FACE ATTENDANCE (optional feature)
-- ========================================
CREATE TABLE IF NOT EXISTS face_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    lesson_id INTEGER,
    method TEXT DEFAULT 'face' CHECK(method IN ('face', 'manual')),
    match_distance REAL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
);

-- ========================================
-- NOTES (Core Aspects > Notes — separate from lesson video content,
-- organized purely by year as the proposal describes, dynamically created)
-- ========================================
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,        -- subject this note belongs to
    course_id INTEGER,                   -- optional course this note belongs to
    title TEXT NOT NULL,
    content TEXT,                         -- rich text/HTML notes content
    file_url TEXT,                        -- optional uploaded PDF/doc
    year INTEGER,                         -- 1-4, denormalized from category for fast filtering
    position INTEGER DEFAULT 0,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- TEAM MEMBERS (Founding Members, Advisory Board, Legal & Business Advisory,
-- The Team — all sourced from the whiteboard/proposal's "CORE TEAM" section)
-- ========================================
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,                   -- e.g. 'Founder', 'Advisory Board', 'Legal & Business Advisory'
    designation TEXT,                     -- e.g. 'Founder & Director', 'Physiotherapy Advisor'
    qualification TEXT,
    photo TEXT DEFAULT '/images/team/default-avatar.png',
    bio TEXT,
    group_name TEXT DEFAULT 'core',
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BLOG POSTS (general articles, poems, quotes, experiences — per proposal)
-- ========================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT DEFAULT '/images/blog/default-cover.jpg',
    post_type TEXT DEFAULT 'article' CHECK(post_type IN ('article', 'poem', 'quote', 'experience')),
    author_id INTEGER,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- RESEARCH DESK (articles per subject — per proposal's "Research Desk" core aspect)
-- ========================================
CREATE TABLE IF NOT EXISTS research_articles (
    id SERIAL PRIMARY KEY,
    category_id INTEGER,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source_url TEXT,                      -- external link to full paper/journal, if applicable
    author_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- LIVE SESSIONS (Live Classes / Live Discussions / Workshops / Webinars / Panel
-- Discussions — per proposal: "only topics + shared links, no live streaming built")
-- ========================================
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    session_type TEXT DEFAULT 'live_class' CHECK(session_type IN ('live_class', 'discussion', 'workshop', 'webinar', 'podcast', 'panel_discussion')),
    category_id INTEGER,
    host_id INTEGER,                      -- instructor/admin hosting it
    scheduled_at TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    zoom_meeting_id TEXT,                  -- Zoom's meeting ID (from Zoom API)
    zoom_join_url TEXT,                    -- real join link returned by Zoom API
    zoom_start_url TEXT,                   -- host-only start link
    status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'live', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS live_session_registrations (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sms_sent INTEGER DEFAULT 0,
    UNIQUE(session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- APPOINTMENTS / CALLBACK REQUESTS (per proposal: "Book An Appointment / Request Call Back")
-- ========================================
CREATE TABLE IF NOT EXISTS appointment_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_date TEXT,
    message TEXT,
    request_type TEXT DEFAULT 'appointment' CHECK(request_type IN ('appointment', 'callback')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'contacted', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- SMS LOG (audit trail for SMS notifications sent to participants)
-- ========================================
CREATE TABLE IF NOT EXISTS sms_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    purpose TEXT,                          -- e.g. 'live_session_reminder', 'enrollment_confirmation'
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed')),
    provider_response TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- ANNOUNCEMENTS / NOTIFICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ========================================
-- PERMISSIONS (Master Registry of System Permissions)
-- ========================================
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    permission_key TEXT UNIQUE NOT NULL, -- e.g. 'COURSE:CREATE', 'BLOG:DELETE'
    resource TEXT NOT NULL,              -- e.g. 'COURSE', 'BLOG', 'LIVE_CLASS', 'SUBJECT', 'CASE_DISCUSSION', 'USER'
    action TEXT NOT NULL,                -- e.g. 'VIEW', 'CREATE', 'EDIT', 'DELETE', 'PUBLISH', 'ASSIGN'
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- USER PERMISSIONS (Explicit permissions assigned to Admin/Instructor)
-- ========================================
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    permission_key TEXT NOT NULL,
    granted_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- CONTENT ACCESS (Granular user assignment for Private / Public content)
-- ========================================
CREATE TABLE IF NOT EXISTS content_access (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL,           -- 'course', 'blog', 'live_session', 'subject', 'case_discussion', 'learning_module', 'note'
    content_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    permission_level TEXT DEFAULT 'view' CHECK(permission_level IN ('view', 'edit', 'admin')),
    assigned_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- AUDIT LOGS (Administrative action trail)
-- ========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER,
    actor_name TEXT,
    actor_email TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,                 -- e.g. 'ADMIN_CREATED', 'PERMISSIONS_UPDATED', 'COURSE_DELETED'
    resource TEXT NOT NULL,               -- e.g. 'USER', 'COURSE', 'BLOG', 'PERMISSIONS'
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================
-- INDEXES for performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance_records(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category_id);
CREATE INDEX IF NOT EXISTS idx_notes_year ON notes(year);
CREATE INDEX IF NOT EXISTS idx_team_group ON team_members(group_name);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_research_category ON research_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_category ON live_sessions(category_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_live_registrations_session ON live_session_registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_categories_year ON categories(year);
CREATE INDEX IF NOT EXISTS idx_user_perms_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_access_target ON content_access(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_access_user ON content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
