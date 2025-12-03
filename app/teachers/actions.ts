"use server";

// Static data for teachers - backend will be integrated later
const getStaticTeachers = () => [
  {
    id: "1",
    teacher_id: "TCH001",
    first_name: "Dr. Sunita",
    last_name: "Verma",
    email: "sunita.verma@school.com",
    phone: "9876543210",
    date_of_birth: "1985-03-15",
    gender: "Female",
    subject: "Mathematics",
    qualification: "Ph.D. in Mathematics",
    experience_years: 12,
    address: "123 Teacher's Colony, Mumbai",
    emergency_contact: "9876543299",
    joining_date: "2012-06-01",
    salary: 75000,
    status: "Active"
  },
  {
    id: "2",
    teacher_id: "TCH002",
    first_name: "Prof. Ramesh",
    last_name: "Kumar",
    email: "ramesh.kumar@school.com",
    phone: "9876543211",
    date_of_birth: "1982-07-20",
    gender: "Male",
    subject: "Physics",
    qualification: "M.Sc. Physics, B.Ed.",
    experience_years: 15,
    address: "456 Education Street, Delhi",
    emergency_contact: "9876543298",
    joining_date: "2009-04-01",
    salary: 80000,
    status: "Active"
  },
  {
    id: "3",
    teacher_id: "TCH003",
    first_name: "Ms. Kavita",
    last_name: "Sharma",
    email: "kavita.sharma@school.com",
    phone: "9876543212",
    date_of_birth: "1988-11-10",
    gender: "Female",
    subject: "English",
    qualification: "M.A. English, B.Ed.",
    experience_years: 8,
    address: "789 Literature Lane, Bangalore",
    emergency_contact: "9876543297",
    joining_date: "2016-07-01",
    salary: 65000,
    status: "Active"
  },
  {
    id: "4",
    teacher_id: "TCH004",
    first_name: "Dr. Anil",
    last_name: "Patel",
    email: "anil.patel@school.com",
    phone: "9876543213",
    date_of_birth: "1980-05-25",
    gender: "Male",
    subject: "Chemistry",
    qualification: "Ph.D. in Chemistry",
    experience_years: 18,
    address: "321 Science Avenue, Pune",
    emergency_contact: "9876543296",
    joining_date: "2006-06-01",
    salary: 85000,
    status: "Active"
  },
  {
    id: "5",
    teacher_id: "TCH005",
    first_name: "Mrs. Meera",
    last_name: "Reddy",
    email: "meera.reddy@school.com",
    phone: "9876543214",
    date_of_birth: "1987-09-12",
    gender: "Female",
    subject: "Biology",
    qualification: "M.Sc. Biology, B.Ed.",
    experience_years: 10,
    address: "654 Nature Road, Hyderabad",
    emergency_contact: "9876543295",
    joining_date: "2014-04-01",
    salary: 70000,
    status: "Active"
  },
  {
    id: "6",
    teacher_id: "TCH006",
    first_name: "Mr. Suresh",
    last_name: "Desai",
    email: "suresh.desai@school.com",
    phone: "9876543215",
    date_of_birth: "1983-12-08",
    gender: "Male",
    subject: "History",
    qualification: "M.A. History, B.Ed.",
    experience_years: 13,
    address: "987 Heritage Street, Ahmedabad",
    emergency_contact: "9876543294",
    joining_date: "2011-06-01",
    salary: 72000,
    status: "Active"
  },
  {
    id: "7",
    teacher_id: "TCH007",
    first_name: "Dr. Priya",
    last_name: "Mehta",
    email: "priya.mehta@school.com",
    phone: "9876543216",
    date_of_birth: "1986-04-22",
    gender: "Female",
    subject: "Computer Science",
    qualification: "Ph.D. in Computer Science",
    experience_years: 9,
    address: "147 Tech Park, Chennai",
    emergency_contact: "9876543293",
    joining_date: "2015-07-01",
    salary: 78000,
    status: "Active"
  },
  {
    id: "8",
    teacher_id: "TCH008",
    first_name: "Mr. Ajay",
    last_name: "Joshi",
    email: "ajay.joshi@school.com",
    phone: "9876543217",
    date_of_birth: "1984-08-30",
    gender: "Male",
    subject: "Geography",
    qualification: "M.A. Geography, B.Ed.",
    experience_years: 11,
    address: "258 Earth Avenue, Kolkata",
    emergency_contact: "9876543292",
    joining_date: "2013-04-01",
    salary: 68000,
    status: "Active"
  }
];

export async function getAllTeachers() {
  // Always return static data for now
  return getStaticTeachers();
}

export async function getTeacherStats() {
  const teachers = getStaticTeachers();
  const subjects = new Set(teachers.map(t => t.subject).filter(Boolean));
  
  return {
    total: teachers.length,
    active: teachers.filter(t => t.status === "Active").length,
    subjects: subjects.size,
  };
}

export async function createTeacher(data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id: Date.now().toString(), ...data }];
}

export async function updateTeacher(id: string, data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id, ...data }];
}

export async function deleteTeacher(id: string) {
  // Static mode - return success (data won't persist until backend is connected)
  return true;
} 