export type UserRole = "student" | "admin";
export type CounsellingStatus =
  | "new"
  | "contacted"
  | "scheduled"
  | "completed"
  | "cancelled";
export type BatchStatus = "active" | "upcoming" | "completed";
export type EnrollmentStatus = "active" | "pending" | "cancelled";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  class_level: string | null;
  target_exam: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Teacher = {
  id: string;
  slug: string;
  name: string;
  subject: string;
  qualification: string;
  experience_years: number;
  rating: number;
  short_bio: string;
  bio: string;
  photo_path: string;
  achievements: string[];
  subjects: string[];
  is_published: boolean;
  created_at: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  exam: string;
  class_level: string;
  duration_months: number;
  original_price: number;
  price: number;
  image_path: string;
  teacher_id: string | null;
  features: string[];
  syllabus: string[];
  faqs: { question: string; answer: string }[];
  is_published: boolean;
  is_popular: boolean;
  created_at: string;
  teachers?: Teacher | null;
};

export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  course_lessons?: CourseLesson[];
};

export type CourseLesson = {
  id: string;
  module_id: string;
  title: string;
  duration_minutes: number;
  sort_order: number;
};

export type Batch = {
  id: string;
  slug: string;
  title: string;
  exam: string;
  class_level: string;
  start_date: string;
  schedule: string;
  seats_total: number;
  seats_available: number;
  status: BatchStatus;
  teacher_id: string | null;
  course_id: string | null;
  is_published: boolean;
  teachers?: Teacher | null;
  courses?: Course | null;
};

export type SamplePaper = {
  id: string;
  title: string;
  slug: string;
  exam: string;
  subject: string;
  class_level: string;
  year: number;
  difficulty: string;
  paper_type: string;
  question_count: number;
  duration_minutes: number;
  file_path: string;
  solution_file_path: string | null;
  file_size: number;
  description: string | null;
  is_published: boolean;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  student_name: string;
  status_label: string;
  quote: string;
  rating: number;
  photo_path: string | null;
  is_published: boolean;
};

export type CounsellingRequest = {
  id: string;
  student_name: string;
  email: string | null;
  phone: string;
  class_target: string;
  preferred_mode: string;
  location: string;
  preferred_time: string | null;
  user_id: string | null;
  request_type: "counselling" | "demo";
  course_id: string | null;
  status: CounsellingStatus;
  notes: string | null;
  created_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  price_at_enrollment: number;
  created_at: string;
  courses?: Course | null;
};

export type Review = {
  id: string;
  teacher_id: string | null;
  course_id: string | null;
  student_name: string;
  rating: number;
  comment: string;
  is_published: boolean;
};

export type DownloadLog = {
  id: string;
  paper_id: string;
  user_id: string | null;
  created_at: string;
  sample_papers?: SamplePaper | null;
};
