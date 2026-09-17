export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  SUBJECT_EXPERT = 'SUBJECT_EXPERT',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  STUDENT = 'STUDENT',
  USER = 'USER'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: RoleName[];
  isFaceEnrolled: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
  requiresFaceVerification?: boolean;
}

export interface FaceVerificationChallenge {
  challengeId: string;
  prompts: ('CENTER_FACE' | 'LOOK_LEFT' | 'LOOK_RIGHT' | 'BLINK_EYES' | 'SMILE')[];
  expiresInSeconds: number;
}

export interface FaceVerificationResult {
  success: boolean;
  confidence: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: UserDTO;
}

export interface SubjectDTO {
  id: string;
  title: string;
  code: string;
  description: string;
  academicYear: string; // "1ST_YEAR" | "2ND_YEAR" | "3RD_YEAR" | "4TH_YEAR" | "OTHER"
  semester?: number;
  category: string; // "CORE" | "SPECIALIZED" | "ELECTIVE"
  icon?: string;
  coverImage?: string;
  chaptersCount?: number;
  topicsCount?: number;
  notesCount?: number;
}

export interface ChapterDTO {
  id: string;
  subjectId: string;
  title: string;
  orderIndex: number;
  description?: string;
  topics?: TopicDTO[];
}

export interface TopicDTO {
  id: string;
  chapterId: string;
  title: string;
  orderIndex: number;
  contentSummary?: string;
  notes?: NoteDTO[];
}

export interface NoteDTO {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  pdfUrl: string;
  fileSizeBytes?: number;
  readingTimeMinutes?: number;
  isDownloadable: boolean;
  createdAt: string;
}

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  thumbnailUrl: string;
  academicYear: string;
  category: string;
  modulesCount: number;
  lessonsCount: number;
  totalDurationMinutes: number;
  completionPercentage?: number;
}

export interface ResearchArticleDTO {
  id: string;
  title: string;
  slug: string;
  authors: string[];
  abstract: string;
  category: string;
  publishedDate: string;
  pdfUrl?: string;
  externalUrl?: string;
  doi?: string;
}

export interface BlogDTO {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorName: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface TeamMemberDTO {
  id: string;
  name: string;
  qualification: string;
  designation: string;
  specialization: string;
  biography: string;
  category: 'TEACHING' | 'NON_TEACHING' | 'SUBJECT_EXPERT' | 'TECHNICAL' | 'OTHER';
  photoUrl: string;
  socialLinks?: Record<string, string>;
}

export interface AppointmentDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  service: string;
  message?: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface LiveClassDTO {
  id: string;
  title: string;
  instructor: string;
  scheduledAt: string;
  durationMinutes: number;
  description: string;
  zoomMeetingUrl?: string;
  zoomMeetingId?: string;
  registrationUrl?: string;
  category: 'CLASS' | 'WORKSHOP' | 'WEBINAR' | 'PODCAST' | 'PANEL';
}

export interface AnalyticsSummaryDTO {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  totalNotes: number;
  totalCourses: number;
  totalAppointments: number;
  totalRevenueINR: number;
  faceVerificationSuccessRate: number;
  activeSessions: number;
}
