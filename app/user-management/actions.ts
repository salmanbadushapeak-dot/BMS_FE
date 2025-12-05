"use server";

// Static data for users - backend will be integrated later
const getStaticUsers = () => [
  {
    id: "1",
    email: "admin@school.com",
    role: "admin",
    first_name: "Admin",
    last_name: "User",
    phone: "9876543210",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-01-15T10:00:00Z",
    last_login: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    email: "teacher@school.com",
    role: "teacher",
    first_name: "John",
    last_name: "Smith",
    phone: "9876543211",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-02-01T10:00:00Z",
    last_login: "2024-01-19T09:15:00Z",
  },
  {
    id: "3",
    email: "student@school.com",
    role: "student",
    first_name: "Alice",
    last_name: "Johnson",
    phone: "9876543212",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-09-01T10:00:00Z",
    last_login: "2024-01-18T16:45:00Z",
  },
  {
    id: "4",
    email: "sarah.williams@school.com",
    role: "teacher",
    first_name: "Sarah",
    last_name: "Williams",
    phone: "9876543213",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-03-15T10:00:00Z",
    last_login: "2024-01-17T11:20:00Z",
  },
  {
    id: "5",
    email: "michael.brown@school.com",
    role: "student",
    first_name: "Michael",
    last_name: "Brown",
    phone: "9876543214",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-09-01T10:00:00Z",
    last_login: "2024-01-16T13:10:00Z",
  },
  {
    id: "6",
    email: "emily.davis@school.com",
    role: "teacher",
    first_name: "Emily",
    last_name: "Davis",
    phone: "9876543215",
    status: "Inactive",
    email_confirmed: true,
    created_at: "2023-04-10T10:00:00Z",
    last_login: "2023-12-20T10:00:00Z",
  },
  {
    id: "7",
    email: "david.miller@school.com",
    role: "student",
    first_name: "David",
    last_name: "Miller",
    phone: "9876543216",
    status: "Active",
    email_confirmed: false,
    created_at: "2023-09-01T10:00:00Z",
    last_login: null,
  },
  {
    id: "8",
    email: "lisa.wilson@school.com",
    role: "admin",
    first_name: "Lisa",
    last_name: "Wilson",
    phone: "9876543217",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-01-20T10:00:00Z",
    last_login: "2024-01-19T15:30:00Z",
  },
  {
    id: "9",
    email: "robert.taylor@school.com",
    role: "student",
    first_name: "Robert",
    last_name: "Taylor",
    phone: "9876543218",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-09-01T10:00:00Z",
    last_login: "2024-01-15T12:00:00Z",
  },
  {
    id: "10",
    email: "jennifer.anderson@school.com",
    role: "teacher",
    first_name: "Jennifer",
    last_name: "Anderson",
    phone: "9876543219",
    status: "Active",
    email_confirmed: true,
    created_at: "2023-05-05T10:00:00Z",
    last_login: "2024-01-18T10:20:00Z",
  },
];

export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
  first_name: string;
  last_name: string;
  phone?: string;
  status: "Active" | "Inactive";
  email_confirmed: boolean;
  created_at: string;
  last_login: string | null;
}

export async function getAllUsers(): Promise<User[]> {
  // Always return static data for now
  return getStaticUsers();
}

export async function getUserStats() {
  const users = getStaticUsers();
  return {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    inactive: users.filter((u) => u.status === "Inactive").length,
    admins: users.filter((u) => u.role === "admin").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    students: users.filter((u) => u.role === "student").length,
    email_confirmed: users.filter((u) => u.email_confirmed).length,
  };
}

export async function createUser(data: {
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<User> {
  // Static mode - return success (data won't persist until backend is connected)
  console.log("Creating user (static):", data);
  return {
    id: Date.now().toString(),
    email: data.email,
    role: data.role,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    status: "Active",
    email_confirmed: false,
    created_at: new Date().toISOString(),
    last_login: null,
  };
}

export async function updateUser(
  id: string,
  data: {
    email?: string;
    role?: "admin" | "teacher" | "student";
    first_name?: string;
    last_name?: string;
    phone?: string;
    status?: "Active" | "Inactive";
  }
): Promise<User> {
  // Static mode - return success (data won't persist until backend is connected)
  console.log(`Updating user ${id} (static):`, data);
  const existingUser = getStaticUsers().find((u) => u.id === id);
  return {
    ...existingUser!,
    ...data,
  };
}

export async function deleteUser(id: string): Promise<boolean> {
  // Static mode - return success (data won't persist until backend is connected)
  console.log(`Deleting user ${id} (static)`);
  return true;
}

export async function changeUserRole(
  id: string,
  role: "admin" | "teacher" | "student"
): Promise<User> {
  // Static mode - return success
  console.log(`Changing user ${id} role to ${role} (static)`);
  const existingUser = getStaticUsers().find((u) => u.id === id);
  return {
    ...existingUser!,
    role,
  };
}

export async function toggleUserStatus(id: string): Promise<User> {
  // Static mode - return success
  console.log(`Toggling user ${id} status (static)`);
  const existingUser = getStaticUsers().find((u) => u.id === id);
  return {
    ...existingUser!,
    status: existingUser!.status === "Active" ? "Inactive" : "Active",
  };
}

