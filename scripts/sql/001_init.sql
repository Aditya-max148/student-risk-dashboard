CREATE TABLE IF NOT EXISTS classrooms (
  id text PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE IF NOT EXISTS subjects (
  id text PRIMARY KEY,
  name text UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  name text NOT NULL,
  class_id text REFERENCES classrooms(id),
  attendance_pct double precision DEFAULT 0,
  avg_score double precision DEFAULT 0,
  fee_status text DEFAULT 'ok',
  risk_level text DEFAULT 'low'
);
CREATE TABLE IF NOT EXISTS attendance (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(id),
  date date NOT NULL,
  present boolean DEFAULT false
);
CREATE TABLE IF NOT EXISTS exam_results (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(id),
  subject_id text REFERENCES subjects(id),
  date date NOT NULL,
  score double precision NOT NULL
);
CREATE TABLE IF NOT EXISTS fee_payments (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(id),
  due_date date,
  paid_date date,
  amount_due double precision,
  amount_paid double precision
);
CREATE TABLE IF NOT EXISTS settings (
  id serial PRIMARY KEY,
  attendance_low double precision DEFAULT 90,
  attendance_medium double precision DEFAULT 75,
  score_low double precision DEFAULT 70,
  score_medium double precision DEFAULT 50,
  fee_days_overdue_medium integer DEFAULT 7,
  fee_days_overdue_high integer DEFAULT 30
);
CREATE TABLE IF NOT EXISTS contacts (
  id serial PRIMARY KEY,
  student_id text REFERENCES students(id),
  type text NOT NULL,
  name text NOT NULL,
  email text,
  phone text
);
