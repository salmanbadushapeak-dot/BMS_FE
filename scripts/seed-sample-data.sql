-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, grade, section, roll_no, address, guardian_name, guardian_phone, guardian_email, admission_date, status) VALUES
('STU001', 'John', 'Doe', 'john.doe@email.com', '9876543210', '2010-05-15', 'Male', '8', 'A', '001', '123 Main Street, City', 'Robert Doe', '9876543211', 'robert.doe@email.com', '2023-04-01', 'Active'),
('STU002', 'Jane', 'Smith', 'jane.smith@email.com', '9876543212', '2009-08-22', 'Female', '9', 'B', '002', '456 Oak Avenue, City', 'Mary Smith', '9876543213', 'mary.smith@email.com', '2023-04-01', 'Active'),
('STU003', 'Mike', 'Johnson', 'mike.johnson@email.com', '9876543214', '2011-03-10', 'Male', '7', 'A', '003', '789 Pine Road, City', 'David Johnson', '9876543215', 'david.johnson@email.com', '2023-04-01', 'Active'),
('STU004', 'Sarah', 'Williams', 'sarah.williams@email.com', '9876543216', '2010-12-05', 'Female', '8', 'B', '004', '321 Elm Street, City', 'Lisa Williams', '9876543217', 'lisa.williams@email.com', '2023-04-01', 'Active'),
('STU005', 'Alex', 'Brown', 'alex.brown@email.com', '9876543218', '2009-07-18', 'Male', '9', 'A', '005', '654 Maple Drive, City', 'Tom Brown', '9876543219', 'tom.brown@email.com', '2023-04-01', 'Active');

-- Insert sample teachers
INSERT INTO teachers (teacher_id, first_name, last_name, email, phone, date_of_birth, gender, subject, qualification, experience_years, address, emergency_contact, joining_date, salary, status) VALUES
('TCH001', 'Emily', 'Davis', 'emily.davis@school.edu', '9876543220', '1985-04-12', 'Female', 'Mathematics', 'M.Sc Mathematics, B.Ed', 8, '111 Teacher Lane, City', '9876543221', '2020-06-01', 45000.00, 'Active'),
('TCH002', 'Michael', 'Wilson', 'michael.wilson@school.edu', '9876543222', '1982-09-25', 'Male', 'English', 'M.A English Literature, B.Ed', 12, '222 Faculty Street, City', '9876543223', '2018-07-15', 48000.00, 'Active'),
('TCH003', 'Lisa', 'Anderson', 'lisa.anderson@school.edu', '9876543224', '1988-01-30', 'Female', 'Science', 'M.Sc Physics, B.Ed', 6, '333 Education Ave, City', '9876543225', '2021-08-01', 42000.00, 'Active'),
('TCH004', 'Robert', 'Taylor', 'robert.taylor@school.edu', '9876543226', '1980-11-08', 'Male', 'Social Studies', 'M.A History, B.Ed', 15, '444 Academic Road, City', '9876543227', '2016-05-20', 50000.00, 'Active'),
('TCH005', 'Jennifer', 'Martinez', 'jennifer.martinez@school.edu', '9876543228', '1987-06-14', 'Female', 'Computer Science', 'M.Tech Computer Science, B.Ed', 7, '555 Tech Boulevard, City', '9876543229', '2019-09-10', 46000.00, 'Active');

-- Insert sample fees
INSERT INTO fees (student_id, academic_year, total_amount, paid_amount, pending_amount, status, payment_method, last_payment_date) VALUES
((SELECT id FROM students WHERE student_id = 'STU001'), '2024-25', 25000.00, 25000.00, 0.00, 'Paid', 'Bank Transfer', '2024-04-15'),
((SELECT id FROM students WHERE student_id = 'STU002'), '2024-25', 25000.00, 15000.00, 10000.00, 'Partial', 'Cash', '2024-05-10'),
((SELECT id FROM students WHERE student_id = 'STU003'), '2024-25', 25000.00, 0.00, 25000.00, 'Pending', NULL, NULL),
((SELECT id FROM students WHERE student_id = 'STU004'), '2024-25', 25000.00, 25000.00, 0.00, 'Paid', 'Online', '2024-04-20'),
((SELECT id FROM students WHERE student_id = 'STU005'), '2024-25', 25000.00, 12000.00, 13000.00, 'Partial', 'Cheque', '2024-06-01');

-- Insert sample exams
INSERT INTO exams (name, date, grade, total_marks, status) VALUES
('Mid-Term Examination', '2024-09-15', '8', 100, 'Completed'),
('Final Examination', '2024-12-10', '8', 100, 'Scheduled'),
('Mid-Term Examination', '2024-09-15', '9', 100, 'Completed'),
('Final Examination', '2024-12-10', '9', 100, 'Scheduled'),
('Unit Test 1', '2024-07-20', '7', 50, 'Completed');

-- Insert sample exam results
INSERT INTO exam_results (exam_id, student_id, subject, marks_obtained, total_marks, grade) VALUES
((SELECT id FROM exams WHERE name = 'Mid-Term Examination' AND grade = '8' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU001'), 'Mathematics', 85, 100, 'A'),
((SELECT id FROM exams WHERE name = 'Mid-Term Examination' AND grade = '8' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU001'), 'English', 78, 100, 'B+'),
((SELECT id FROM exams WHERE name = 'Mid-Term Examination' AND grade = '8' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU004'), 'Mathematics', 92, 100, 'A+'),
((SELECT id FROM exams WHERE name = 'Mid-Term Examination' AND grade = '9' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU002'), 'Science', 88, 100, 'A'),
((SELECT id FROM exams WHERE name = 'Mid-Term Examination' AND grade = '9' LIMIT 1), (SELECT id FROM students WHERE student_id = 'STU005'), 'English', 82, 100, 'A');

-- Insert sample sports teams
INSERT INTO sports_teams (name, sport, coach, captain_id, description, status) VALUES
('Eagles Basketball', 'Basketball', 'Coach Johnson', (SELECT id FROM students WHERE student_id = 'STU005'), 'School basketball team competing in inter-school tournaments', 'Active'),
('Lions Football', 'Football', 'Coach Smith', (SELECT id FROM students WHERE student_id = 'STU001'), 'Premier football team of the school', 'Active'),
('Sharks Swimming', 'Swimming', 'Coach Davis', (SELECT id FROM students WHERE student_id = 'STU002'), 'Competitive swimming team', 'Active'),
('Hawks Cricket', 'Cricket', 'Coach Wilson', (SELECT id FROM students WHERE student_id = 'STU003'), 'School cricket team', 'Active'),
('Panthers Track', 'Athletics', 'Coach Brown', (SELECT id FROM students WHERE student_id = 'STU004'), 'Track and field athletics team', 'Active');

-- Insert sample sports events
INSERT INTO sports_events (name, date, venue, sport, status, priority) VALUES
('Inter-School Basketball Championship', '2024-08-15', 'School Gymnasium', 'Basketball', 'Completed', 'High'),
('Annual Sports Day', '2024-10-20', 'School Ground', 'Athletics', 'Upcoming', 'High'),
('Football League Match', '2024-07-30', 'City Stadium', 'Football', 'Completed', 'Medium'),
('Swimming Competition', '2024-09-05', 'Aquatic Center', 'Swimming', 'Upcoming', 'Medium'),
('Cricket Tournament', '2024-11-10', 'Sports Complex', 'Cricket', 'Upcoming', 'High');

-- Insert sample sports participation
INSERT INTO sports_participation (student_id, team_id, position, achievements) VALUES
((SELECT id FROM students WHERE student_id = 'STU001'), (SELECT id FROM sports_teams WHERE name = 'Lions Football'), 'Forward', ARRAY['Best Player 2023', 'Top Scorer']),
((SELECT id FROM students WHERE student_id = 'STU002'), (SELECT id FROM sports_teams WHERE name = 'Sharks Swimming'), 'Freestyle Swimmer', ARRAY['Regional Champion', 'School Record Holder']),
((SELECT id FROM students WHERE student_id = 'STU003'), (SELECT id FROM sports_teams WHERE name = 'Hawks Cricket'), 'Batsman', ARRAY['Century Scorer', 'Man of the Match']),
((SELECT id FROM students WHERE student_id = 'STU004'), (SELECT id FROM sports_teams WHERE name = 'Panthers Track'), 'Sprinter', ARRAY['100m Champion', 'State Qualifier']),
((SELECT id FROM students WHERE student_id = 'STU005'), (SELECT id FROM sports_teams WHERE name = 'Eagles Basketball'), 'Point Guard', ARRAY['Team Captain', 'MVP 2024']);

-- Insert sample attendance records
INSERT INTO attendance (student_id, date, status, time_in, time_out) VALUES
((SELECT id FROM students WHERE student_id = 'STU001'), '2024-07-01', 'Present', '08:00:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU001'), '2024-07-02', 'Present', '08:05:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU001'), '2024-07-03', 'Late', '08:15:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU002'), '2024-07-01', 'Present', '07:55:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU002'), '2024-07-02', 'Absent', NULL, NULL),
((SELECT id FROM students WHERE student_id = 'STU003'), '2024-07-01', 'Present', '08:00:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU004'), '2024-07-01', 'Present', '08:02:00', '15:30:00'),
((SELECT id FROM students WHERE student_id = 'STU005'), '2024-07-01', 'Present', '07:58:00', '15:30:00');

-- Insert sample users for authentication
INSERT INTO users (email, password_hash, first_name, last_name, role, status) VALUES
('admin@school.edu', '$2b$10$example_hash_for_admin', 'Admin', 'User', 'admin', 'active'),
('emily.davis@school.edu', '$2b$10$example_hash_for_teacher', 'Emily', 'Davis', 'teacher', 'active'),
('john.doe@email.com', '$2b$10$example_hash_for_student', 'John', 'Doe', 'student', 'active'),
('robert.doe@email.com', '$2b$10$example_hash_for_parent', 'Robert', 'Doe', 'parent', 'active');
