"use server";

// Static data for students - backend will be integrated later
const getStaticStudents = () => [
  {
    id: "1",
    student_id: "STU001",
    first_name: "Raj",
    last_name: "Kumar",
    date_of_birth: "2010-05-15",
    gender: "Male",
    grade: "10th",
    contact_number: "9876543210",
    email: "raj.kumar@example.com",
    address: "123 Main Street, Mumbai",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "2",
    student_id: "STU002",
    first_name: "Priya",
    last_name: "Sharma",
    date_of_birth: "2011-08-22",
    gender: "Female",
    grade: "9th",
    contact_number: "9876543211",
    email: "priya.sharma@example.com",
    address: "456 Park Avenue, Delhi",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "3",
    student_id: "STU003",
    first_name: "Amit",
    last_name: "Patel",
    date_of_birth: "2010-12-10",
    gender: "Male",
    grade: "10th",
    contact_number: "9876543212",
    email: "amit.patel@example.com",
    address: "789 Oak Road, Bangalore",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "4",
    student_id: "STU004",
    first_name: "Sneha",
    last_name: "Singh",
    date_of_birth: "2011-03-18",
    gender: "Female",
    grade: "9th",
    contact_number: "9876543213",
    email: "sneha.singh@example.com",
    address: "321 Elm Street, Pune",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "5",
    student_id: "STU005",
    first_name: "Vikram",
    last_name: "Reddy",
    date_of_birth: "2010-07-25",
    gender: "Male",
    grade: "10th",
    contact_number: "9876543214",
    email: "vikram.reddy@example.com",
    address: "654 Pine Lane, Hyderabad",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "6",
    student_id: "STU006",
    first_name: "Ananya",
    last_name: "Desai",
    date_of_birth: "2011-11-05",
    gender: "Female",
    grade: "9th",
    contact_number: "9876543215",
    email: "ananya.desai@example.com",
    address: "987 Cedar Avenue, Ahmedabad",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "7",
    student_id: "STU007",
    first_name: "Rohan",
    last_name: "Mehta",
    date_of_birth: "2010-02-14",
    gender: "Male",
    grade: "10th",
    contact_number: "9876543216",
    email: "rohan.mehta@example.com",
    address: "147 Maple Drive, Chennai",
    enrollment_date: "2023-04-01",
    status: "Active"
  },
  {
    id: "8",
    student_id: "STU008",
    first_name: "Isha",
    last_name: "Joshi",
    date_of_birth: "2011-09-30",
    gender: "Female",
    grade: "9th",
    contact_number: "9876543217",
    email: "isha.joshi@example.com",
    address: "258 Birch Street, Kolkata",
    enrollment_date: "2023-04-01",
    status: "Active"
  }
];

export async function getAllStudents() {
  // Always return static data for now
  return getStaticStudents();
}

export async function createStudent(data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id: Date.now().toString(), ...data }];
}

export async function updateStudent(id: string, data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id, ...data }];
}

export async function deleteStudent(id: string) {
  // Static mode - return success (data won't persist until backend is connected)
  return true;
} 