-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    section VARCHAR(5) NOT NULL,
    roll_no VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    guardian_name VARCHAR(200) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_email VARCHAR(255),
    previous_school VARCHAR(255),
    medical_conditions TEXT,
    admission_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    time_in TIME,
    time_out TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Fees table
CREATE TABLE fees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    pending_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    last_payment_date DATE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sports teams table
CREATE TABLE sports_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    coach VARCHAR(100) NOT NULL,
    captain_id UUID REFERENCES students(id),
    status VARCHAR(20) DEFAULT 'Active',
    achievements TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sports participation table
CREATE TABLE sports_participation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    team_id UUID REFERENCES sports_teams(id) ON DELETE CASCADE,
    position VARCHAR(50) NOT NULL,
    joined_date DATE NOT NULL,
    achievements TEXT[],
    UNIQUE(student_id, team_id)
);

-- Exams table
CREATE TABLE exams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    grade VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exam results table
CREATE TABLE exam_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    subject VARCHAR(50) NOT NULL,
    marks_obtained INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    grade VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, exam_id, subject)
);

-- Create indexes for better performance
CREATE INDEX idx_students_grade_section ON students(grade, section);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_fees_student_year ON fees(student_id, academic_year);
CREATE INDEX idx_exam_results_student_exam ON exam_results(student_id, exam_id);
