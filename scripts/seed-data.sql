-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, grade, section, roll_no, address, guardian_name, guardian_phone, guardian_email, admission_date, status) VALUES
('STU001', 'John', 'Doe', 'john.doe@email.com', '+1234567890', '2008-05-15', 'Male', '10th', 'A', '101', '123 Main St, City', 'Jane Doe', '+1234567800', 'jane.doe@email.com', '2024-04-15', 'Active'),
('STU002', 'Sarah', 'Wilson', 'sarah.wilson@email.com', '+1234567891', '2009-03-22', 'Female', '9th', 'B', '205', '456 Oak Ave, City', 'Mike Wilson', '+1234567801', 'mike.wilson@email.com', '2024-04-10', 'Active'),
('STU003', 'Michael', 'Brown', 'michael.brown@email.com', '+1234567892', '2007-08-10', 'Male', '11th', 'A', '301', '789 Pine St, City', 'Lisa Brown', '+1234567802', 'lisa.brown@email.com', '2024-03-20', 'Active'),
('STU004', 'Emily', 'Davis', 'emily.davis@email.com', '+1234567893', '2008-12-03', 'Female', '10th', 'C', '102', '321 Elm St, City', 'Robert Davis', '+1234567803', 'robert.davis@email.com', '2024-04-05', 'Active'),
('STU005', 'David', 'Johnson', 'david.johnson@email.com', '+1234567894', '2008-07-18', 'Male', '10th', 'A', '105', '654 Maple Ave, City', 'Susan Johnson', '+1234567804', 'susan.johnson@email.com', '2024-04-01', 'Active');

-- Insert sample fees
INSERT INTO fees (student_id, academic_year, total_amount, paid_amount, pending_amount, status, last_payment_date, payment_method) 
SELECT 
    id, 
    '2024-25', 
    CASE 
        WHEN grade = '9th' THEN 14000
        WHEN grade = '10th' THEN 15000
        WHEN grade = '11th' THEN 16000
        ELSE 15000
    END,
    CASE 
        WHEN student_id = 'STU001' THEN 15000
        WHEN student_id = 'STU002' THEN 10000
        WHEN student_id = 'STU003' THEN 0
        WHEN student_id = 'STU004' THEN 7500
        WHEN student_id = 'STU005' THEN 15000
    END,
    CASE 
        WHEN student_id = 'STU001' THEN 0
        WHEN student_id = 'STU002' THEN 4000
        WHEN student_id = 'STU003' THEN 16000
        WHEN student_id = 'STU004' THEN 7500
        WHEN student_id = 'STU005' THEN 0
    END,
    CASE 
        WHEN student_id IN ('STU001', 'STU005') THEN 'Paid'
        WHEN student_id IN ('STU002', 'STU004') THEN 'Partial'
        ELSE 'Pending'
    END,
    CASE 
        WHEN student_id = 'STU001' THEN DATE '2024-01-15'
        WHEN student_id = 'STU002' THEN DATE '2024-01-10'
        WHEN student_id = 'STU004' THEN DATE '2024-01-08'
        WHEN student_id = 'STU005' THEN DATE '2024-01-12'
        ELSE NULL
    END,
    CASE 
        WHEN student_id = 'STU001' THEN 'Online'
        WHEN student_id = 'STU002' THEN 'Cash'
        WHEN student_id = 'STU004' THEN 'Bank Transfer'
        WHEN student_id = 'STU005' THEN 'Online'
        ELSE NULL
    END
FROM students;

-- Insert sample sports teams
INSERT INTO sports_teams (name, sport, coach, achievements) VALUES
('Eagles Basketball', 'Basketball', 'Mr. Johnson', ARRAY['Inter-school Championship 2024', 'District Level Winner']),
('Lions Football', 'Football', 'Ms. Smith', ARRAY['Regional Tournament Runner-up']),
('Tigers Cricket', 'Cricket', 'Mr. Brown', ARRAY['State Level Qualifier']),
('Sharks Swimming', 'Swimming', 'Ms. Davis', ARRAY['District Championship Winner']);

-- Insert sample attendance for the last 7 days
INSERT INTO attendance (student_id, date, status, time_in, time_out)
SELECT 
    s.id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
    CASE 
        WHEN random() < 0.9 THEN 'Present'
        WHEN random() < 0.95 THEN 'Late'
        ELSE 'Absent'
    END,
    CASE 
        WHEN random() < 0.9 THEN TIME '08:30:00'
        ELSE TIME '09:15:00'
    END,
    TIME '15:30:00'
FROM students s
WHERE s.status = 'Active';

-- Insert sample exams
INSERT INTO exams (name, date, grade, status) VALUES
('Mid-Term Exam 2024', DATE '2024-01-15', '10th', 'Completed'),
('Final Exam 2024', DATE '2024-03-15', '10th', 'Upcoming'),
('Unit Test 1', DATE '2024-02-01', '10th', 'Completed'),
('Mid-Term Exam 2024', DATE '2024-01-15', '9th', 'Completed'),
('Mid-Term Exam 2024', DATE '2024-01-15', '11th', 'Completed');

-- Insert sample exam results
INSERT INTO exam_results (student_id, exam_id, subject, marks_obtained, total_marks, grade)
SELECT 
    s.id,
    e.id,
    subject,
    marks,
    100,
    CASE 
        WHEN marks >= 90 THEN 'A+'
        WHEN marks >= 80 THEN 'A'
        WHEN marks >= 70 THEN 'B+'
        WHEN marks >= 60 THEN 'B'
        WHEN marks >= 50 THEN 'C'
        ELSE 'F'
    END
FROM students s
CROSS JOIN exams e
CROSS JOIN (
    VALUES 
        ('Mathematics', 85),
        ('Science', 78),
        ('English', 92),
        ('History', 76),
        ('Geography', 82)
) AS subjects(subject, marks)
WHERE s.grade = e.grade AND e.status = 'Completed' AND s.student_id = 'STU001'

UNION ALL

SELECT 
    s.id,
    e.id,
    subject,
    marks,
    100,
    CASE 
        WHEN marks >= 90 THEN 'A+'
        WHEN marks >= 80 THEN 'A'
        WHEN marks >= 70 THEN 'B+'
        WHEN marks >= 60 THEN 'B'
        WHEN marks >= 50 THEN 'C'
        ELSE 'F'
    END
FROM students s
CROSS JOIN exams e
CROSS JOIN (
    VALUES 
        ('Mathematics', 95),
        ('Science', 88),
        ('English', 89),
        ('History', 91),
        ('Geography', 87)
) AS subjects(subject, marks)
WHERE s.grade = e.grade AND e.status = 'Completed' AND s.student_id = 'STU002';
