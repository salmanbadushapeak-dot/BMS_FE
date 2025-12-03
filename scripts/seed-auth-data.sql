-- Insert sample user profiles (run this after creating users in Supabase Auth)
-- You'll need to replace the UUIDs with actual user IDs from auth.users

-- Sample admin user profile
-- INSERT INTO user_profiles (id, role, first_name, last_name, phone) VALUES
-- ('admin-user-uuid-here', 'admin', 'Admin', 'User', '+1234567890');

-- Sample teacher user profile  
-- INSERT INTO user_profiles (id, role, first_name, last_name, phone) VALUES
-- ('teacher-user-uuid-here', 'teacher', 'John', 'Teacher', '+1234567891');

-- Sample student user profile
-- INSERT INTO user_profiles (id, role, first_name, last_name, phone, student_id) VALUES
-- ('student-user-uuid-here', 'student', 'Jane', 'Student', '+1234567892', 'student-record-uuid-here');

-- Note: You need to create these users in Supabase Auth first, then update the UUIDs above
