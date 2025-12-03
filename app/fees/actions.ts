"use server";

// Static data for fees - backend will be integrated later
const getStaticFees = () => [
  {
    id: "1",
    student_id: "1",
    amount_due: 25000,
    amount_paid: 20000,
    due_date: "2024-02-15",
    status: "Partial",
    payment_date: "2024-01-20"
  },
  {
    id: "2",
    student_id: "2",
    amount_due: 25000,
    amount_paid: 25000,
    due_date: "2024-02-15",
    status: "Paid",
    payment_date: "2024-01-18"
  },
  {
    id: "3",
    student_id: "3",
    amount_due: 25000,
    amount_paid: 0,
    due_date: "2024-02-15",
    status: "Pending",
    payment_date: null
  },
  {
    id: "4",
    student_id: "4",
    amount_due: 25000,
    amount_paid: 15000,
    due_date: "2024-02-15",
    status: "Partial",
    payment_date: "2024-01-25"
  },
  {
    id: "5",
    student_id: "5",
    amount_due: 25000,
    amount_paid: 25000,
    due_date: "2024-02-15",
    status: "Paid",
    payment_date: "2024-01-15"
  },
  {
    id: "6",
    student_id: "6",
    amount_due: 25000,
    amount_paid: 0,
    due_date: "2024-02-15",
    status: "Pending",
    payment_date: null
  },
  {
    id: "7",
    student_id: "7",
    amount_due: 25000,
    amount_paid: 25000,
    due_date: "2024-02-15",
    status: "Paid",
    payment_date: "2024-01-22"
  },
  {
    id: "8",
    student_id: "8",
    amount_due: 25000,
    amount_paid: 10000,
    due_date: "2024-02-15",
    status: "Partial",
    payment_date: "2024-01-28"
  }
];

// Static data for students (for fees page)
const getStaticStudents = () => [
  {
    id: "1",
    first_name: "Raj",
    last_name: "Kumar"
  },
  {
    id: "2",
    first_name: "Priya",
    last_name: "Sharma"
  },
  {
    id: "3",
    first_name: "Amit",
    last_name: "Patel"
  },
  {
    id: "4",
    first_name: "Sneha",
    last_name: "Singh"
  },
  {
    id: "5",
    first_name: "Vikram",
    last_name: "Reddy"
  },
  {
    id: "6",
    first_name: "Ananya",
    last_name: "Desai"
  },
  {
    id: "7",
    first_name: "Rohan",
    last_name: "Mehta"
  },
  {
    id: "8",
    first_name: "Isha",
    last_name: "Joshi"
  }
];

export async function getAllFees() {
  // Always return static data for now
  return { data: getStaticFees(), error: null };
}

export async function getAllStudents() {
  // Always return static data for now
  return { data: getStaticStudents(), error: null };
}

export async function createFee(data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id: Date.now().toString(), ...data }];
}

export async function updateFee(id: string, data: any) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{ id, ...data }];
}

export async function deleteFee(id: string) {
  // Static mode - return success (data won't persist until backend is connected)
  return true;
}

