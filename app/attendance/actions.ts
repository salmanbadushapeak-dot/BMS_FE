"use server";

// Static data for attendance - backend will be integrated later
const getStaticAttendance = (dateStr: string) => [
  {
    id: "1",
    student_id: "STU001",
    date: dateStr,
    status: "Present",
    time_in: "08:30",
    time_out: "15:30"
  },
  {
    id: "2",
    student_id: "STU002",
    date: dateStr,
    status: "Present",
    time_in: "08:25",
    time_out: "15:30"
  },
  {
    id: "3",
    student_id: "STU003",
    date: dateStr,
    status: "Late",
    time_in: "09:15",
    time_out: "15:30"
  },
  {
    id: "4",
    student_id: "STU004",
    date: dateStr,
    status: "Present",
    time_in: "08:30",
    time_out: "15:30"
  },
  {
    id: "5",
    student_id: "STU005",
    date: dateStr,
    status: "Absent",
    time_in: null,
    time_out: null
  },
  {
    id: "6",
    student_id: "STU006",
    date: dateStr,
    status: "Present",
    time_in: "08:28",
    time_out: "15:30"
  },
  {
    id: "7",
    student_id: "STU007",
    date: dateStr,
    status: "Present",
    time_in: "08:30",
    time_out: "15:30"
  },
  {
    id: "8",
    student_id: "STU008",
    date: dateStr,
    status: "Late",
    time_in: "09:05",
    time_out: "15:30"
  }
];

export async function getAttendanceByDate(dateStr: string) {
  // Always return static data for now
  return getStaticAttendance(dateStr);
}

export async function getAttendanceStats(dateStr: string) {
  const attendance = getStaticAttendance(dateStr);
  
  return {
    total: attendance.length,
    present: attendance.filter((r) => r.status === "Present").length,
    absent: attendance.filter((r) => r.status === "Absent").length,
    late: attendance.filter((r) => r.status === "Late").length,
  };
}

export async function markAttendance(
  studentId: string,
  dateStr: string,
  status: "Present" | "Absent" | "Late",
  timeIn?: string
) {
  // Static mode - return success (data won't persist until backend is connected)
  return [{
    id: Date.now().toString(),
    student_id: studentId,
    date: dateStr,
    status: status,
    time_in: timeIn || null,
    time_out: null
  }];
}

