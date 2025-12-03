"use server"

// Static mock data for dashboard - backend will be integrated later
const getStaticStats = () => ({
  totalStudents: 1247,
  activeStudents: 1189,
  totalTeachers: 68,
  activeTeachers: 65,
  pendingFees: 125000,
})

export async function fetchDashboardStatsAction() {
  // Always return static data for now
  // Backend integration will be done separately later
  return { 
    success: true, 
    data: getStaticStats()
  }
}
