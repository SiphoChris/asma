import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["admin", "instructor", "student"]);

export const enrolmentStatusEnum = pgEnum("enrolment_status", [
  "pending", // signed up, awaiting review
  "active", // paid + approved
  "paused", // manually paused by admin
  "appealing", // student has submitted an appeal
  "cancelled", // terminated
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "text", // rich text (Tiptap JSON)
  "video", // YouTube / external video link
  "quiz", // lmscn quiz component
  "exam_practice", // past paper PDF + MCQ overlay
  "game", // future lmscn games
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "card",
  "eft",
  "cash",
  "capitec_pay",
  "debicheck",
  "other",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const termEnum = pgEnum("term", ["1", "2", "3", "4"]);

// ─────────────────────────────────────────
// USERS (extends Supabase auth.users)
// ─────────────────────────────────────────

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // mirrors auth.users.id
  role: userRoleEnum("role").notNull().default("student"),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  school: varchar("school", { length: 255 }), // students only
  grade: integer("grade"), // 8–12
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// SUBJECTS & CAPS TAXONOMY
// ─────────────────────────────────────────

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "Mathematics"
  code: varchar("code", { length: 20 }).notNull(), // e.g. "MATH"
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// e.g. "Mathematics Grade 10" — the unit a student subscribes to
export const subjectGrades = pgTable(
  "subject_grades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectId: uuid("subject_id")
      .references(() => subjects.id, { onDelete: "cascade" })
      .notNull(),
    grade: integer("grade").notNull(), // 8–12
    isActive: boolean("is_active").default(true).notNull(),
  },
  (t) => ({
    uniqueSubjectGrade: uniqueIndex("uq_subject_grade").on(t.subjectId, t.grade),
  }),
);

// ─────────────────────────────────────────
// SUBSCRIPTIONS & ENROLMENT
// ─────────────────────────────────────────

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "Monthly - Grade 10"
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(), // store in ZAR cents
  billingCycle: varchar("billing_cycle", { length: 20 }).notNull().default("monthly"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enrolments = pgTable("enrolments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  planId: uuid("plan_id")
    .references(() => subscriptionPlans.id)
    .notNull(),
  status: enrolmentStatusEnum("status").notNull().default("pending"),
  appealReason: text("appeal_reason"),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"), // admin notes
  startedAt: timestamp("started_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  enrolmentId: uuid("enrolment_id")
    .references(() => enrolments.id, { onDelete: "cascade" })
    .notNull(),
  amountInCents: integer("amount_in_cents").notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  // Stitch payment reference (null for cash/manual EFT)
  stitchPaymentId: varchar("stitch_payment_id", { length: 255 }),
  recordedBy: uuid("recorded_by").references(() => profiles.id), // for manual payments
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectGradeId: uuid("subject_grade_id")
    .references(() => subjectGrades.id)
    .notNull(),
  instructorId: uuid("instructor_id")
    .references(() => profiles.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  isPublished: boolean("is_published").default(false).notNull(),
  // preview content visible before enrolment
  previewDescription: text("preview_description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// LESSONS
// A lesson is a container; its actual content
// lives in ordered content blocks below.
// ─────────────────────────────────────────

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  chapterId: uuid("chapter_id")
    .references(() => chapters.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  type: lessonTypeEnum("type").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  // For exam practice: duration in minutes (null = untimed)
  timeLimitMinutes: integer("time_limit_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ordered content blocks within a lesson (Notion-style)
// Each block is one of: rich_text, video, katex, mafs_graph, image
export const lessonBlocks = pgTable(
  "lesson_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .references(() => lessons.id, { onDelete: "cascade" })
      .notNull(),
    // block type: "rich_text" | "video" | "katex" | "mafs_graph" | "image"
    blockType: varchar("block_type", { length: 30 }).notNull(),
    // Tiptap JSON for rich_text; config JSON for others
    // rich_text: { type: "doc", content: [...] }
    // video:     { url: "https://youtube.com/..." }
    // katex:     { expression: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" }
    // mafs_graph:{ functions: ["x^2", "2x+1"], xRange: [-5,5] }
    // image:     { url: "...", alt: "..." }
    content: jsonb("content").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    lessonIdx: index("lesson_blocks_lesson_idx").on(t.lessonId),
  }),
);

// ─────────────────────────────────────────
// QUIZZES (lmscn quiz component)
// Quizzes are attached to a lesson of type "quiz"
// ─────────────────────────────────────────

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // one quiz per lesson
  title: varchar("title", { length: 255 }).notNull(),
  instructions: text("instructions"),
  timeLimitMinutes: integer("time_limit_minutes"), // null = untimed
  passMark: integer("pass_mark").default(50).notNull(), // percentage
  randomiseQuestions: boolean("randomise_questions").default(false).notNull(),
  randomiseOptions: boolean("randomise_options").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id")
    .references(() => quizzes.id, { onDelete: "cascade" })
    .notNull(),
  // The question text as Tiptap JSON (supports KaTeX nodes for maths)
  questionContent: jsonb("question_content").notNull(),
  marks: integer("marks").default(1).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  explanation: jsonb("explanation"), // shown after attempt
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionOptions = pgTable("question_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),
  // Option text as Tiptap JSON (supports KaTeX for maths options)
  optionContent: jsonb("option_content").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─────────────────────────────────────────
// EXAM PRACTICE
// Past papers uploaded by instructor.
// Student sees the PDF in a resizable pane
// and answers MCQs alongside it.
// Reuses quizzes table for the MCQ layer.
// ─────────────────────────────────────────

export const examPapers = pgTable("exam_papers", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  title: varchar("title", { length: 255 }).notNull(),
  year: integer("year"),
  paperNumber: integer("paper_number"), // Paper 1 or Paper 2
  pdfUrl: text("pdf_url").notNull(), // Supabase Storage URL
  timeLimitMinutes: integer("time_limit_minutes"), // null = untimed
  // The MCQ overlay is a quiz — linked here
  quizId: uuid("quiz_id").references(() => quizzes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────
// STUDENT PROGRESS
// ─────────────────────────────────────────

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    lessonId: uuid("lesson_id")
      .references(() => lessons.id, { onDelete: "cascade" })
      .notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    completedAt: timestamp("completed_at"),
    // For video lessons: last watched position in seconds
    videoPositionSeconds: integer("video_position_seconds"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueStudentLesson: uniqueIndex("uq_student_lesson").on(t.studentId, t.lessonId),
  }),
);

// Only the last attempt is stored per student per quiz
export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    quizId: uuid("quiz_id")
      .references(() => quizzes.id, { onDelete: "cascade" })
      .notNull(),
    // Snapshot of answers: [{ questionId, selectedOptionId }]
    answers: jsonb("answers").notNull(),
    scorePercent: decimal("score_percent", { precision: 5, scale: 2 }).notNull(),
    marksEarned: integer("marks_earned").notNull(),
    marksTotal: integer("marks_total").notNull(),
    passed: boolean("passed").notNull(),
    timeTakenSeconds: integer("time_taken_seconds"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueStudentQuiz: uniqueIndex("uq_student_quiz").on(t.studentId, t.quizId),
  }),
);

// ─────────────────────────────────────────
// ACADEMIC PROGRESS TRACKING
// Students enter their school report marks
// per subject per term. Displayed as a
// year-end progress report.
// ─────────────────────────────────────────

export const academicYears = pgTable("academic_years", {
  id: uuid("id").primaryKey().defaultRandom(),
  year: integer("year").notNull().unique(), // e.g. 2025
  isActive: boolean("is_active").default(true).notNull(),
});

export const studentReportMarks = pgTable(
  "student_report_marks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    subjectGradeId: uuid("subject_grade_id")
      .references(() => subjectGrades.id)
      .notNull(),
    academicYearId: uuid("academic_year_id")
      .references(() => academicYears.id)
      .notNull(),
    term: termEnum("term").notNull(),
    // Percentage mark e.g. 72.5
    markPercent: decimal("mark_percent", { precision: 5, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueStudentTermMark: uniqueIndex("uq_student_term_mark").on(
      t.studentId,
      t.subjectGradeId,
      t.academicYearId,
      t.term,
    ),
  }),
);

// ─────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────

export const profileRelations = relations(profiles, ({ many }) => ({
  enrolments: many(enrolments),
  reportMarks: many(studentReportMarks),
  lessonProgress: many(lessonProgress),
  quizAttempts: many(quizAttempts),
  taughtCourses: many(courses),
}));

export const subjectRelations = relations(subjects, ({ many }) => ({
  subjectGrades: many(subjectGrades),
}));

export const subjectGradeRelations = relations(subjectGrades, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [subjectGrades.subjectId],
    references: [subjects.id],
  }),
  courses: many(courses),
  reportMarks: many(studentReportMarks),
}));

export const enrolmentRelations = relations(enrolments, ({ one, many }) => ({
  student: one(profiles, {
    fields: [enrolments.studentId],
    references: [profiles.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [enrolments.planId],
    references: [subscriptionPlans.id],
  }),
  payments: many(payments),
}));

export const courseRelations = relations(courses, ({ one, many }) => ({
  subjectGrade: one(subjectGrades, {
    fields: [courses.subjectGradeId],
    references: [subjectGrades.id],
  }),
  instructor: one(profiles, {
    fields: [courses.instructorId],
    references: [profiles.id],
  }),
  chapters: many(chapters),
}));

export const chapterRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  blocks: many(lessonBlocks),
  quiz: one(quizzes),
  examPaper: one(examPapers),
  progress: many(lessonProgress),
}));

export const quizRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(questions),
  attempts: many(quizAttempts),
}));

export const questionRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  options: many(questionOptions),
}));
