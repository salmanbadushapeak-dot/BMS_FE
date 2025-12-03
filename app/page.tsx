"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SafeSidebarTrigger } from "@/components/safe-sidebar-trigger"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Users, BookOpen, DollarSign, CalendarDays, GraduationCap, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchDashboardStatsAction } from "@/app/actions/dashboard"

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalTeachers: number
  activeTeachers: number
  pendingFees: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    activeTeachers: 0,
    pendingFees: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      const result = await fetchDashboardStatsAction()
      if (result.success) {
        setStats(result.data)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    const result = await fetchDashboardStatsAction()
    if (result.success) {
      setStats(result.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 shrink-0">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SafeSidebarTrigger />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
          {/* Hero Section */}
          <section 
            className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8 shadow-lg"
            style={{
              backgroundImage: "url('/Image1.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            {/* Light Overlay for Image Visibility */}
            <div className="absolute inset-0 bg-white/5 z-[1]" />
            {/* Gradient Overlay for Text Readability - Light so image shows through */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/30 to-purple-800/30 z-[2]" />
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full p-4">
              <div className="text-center text-white">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                  Welcome to Our School Management System
                </h2>
                <p className="text-lg md:text-xl font-medium drop-shadow-md">
                  Empowering education through efficient administration.
                </p>
              </div>
            </div>
          </section>

          {/* Overview Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Active: {stats.activeStudents}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">Active: {stats.activeTeachers}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">₹{stats.pendingFees.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Outstanding payments</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div> {/* Placeholder for actual data */}
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Perform common tasks quickly</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/enrollment" className="block">
                  <Button variant="outline" className="justify-start w-full bg-transparent">
                    <GraduationCap className="mr-2 h-4 w-4" /> Enroll New Student
                  </Button>
                </Link>
                <Link href="/fees" className="block">
                  <Button variant="outline" className="justify-start w-full bg-transparent">
                    <DollarSign className="mr-2 h-4 w-4" /> Record Fee Payment
                  </Button>
                </Link>
                <Link href="/results" className="block">
                  <Button variant="outline" className="justify-start w-full bg-transparent">
                    <Award className="mr-2 h-4 w-4" /> Publish Results
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Academic Performance Chart */}
            <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Academic Performance Overview</CardTitle>
                <CardDescription>Average scores across grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 flex items-end justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  {/* Bar Chart */}
                  {[
                    { grade: "9th", score: 85, color: "bg-blue-500", label: "9th Grade" },
                    { grade: "10th", score: 88, color: "bg-green-500", label: "10th Grade" },
                    { grade: "11th", score: 82, color: "bg-purple-500", label: "11th Grade" },
                    { grade: "12th", score: 90, color: "bg-orange-500", label: "12th Grade" },
                  ].map((item, index) => {
                    // Calculate bar height (max score is 100, container height is 256px = h-64)
                    const barHeight = (item.score / 100) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full">
                        <div className="w-full flex flex-col items-end justify-end h-full relative">
                          {/* Y-axis value label */}
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {item.score}%
                          </div>
                          {/* Bar */}
                          <div
                            className={`w-full ${item.color} rounded-t-lg transition-all hover:opacity-90 cursor-pointer relative group shadow-md hover:shadow-lg`}
                            style={{ height: `${barHeight}%`, minHeight: '20px' }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              {item.score}%
                            </div>
                          </div>
                        </div>
                        {/* Grade label */}
                        <span className="text-sm font-medium text-muted-foreground">{item.grade}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>9th Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>10th Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>11th Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>12th Grade</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Trends Chart */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Monthly attendance rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 relative p-4">
                {/* Line Chart */}
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  {/* Background grid */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={200 - (y * 2)}
                      x2="400"
                      y2={200 - (y * 2)}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-200 dark:text-gray-700"
                    />
                  ))}
                  {/* Data points and line */}
                  <path
                    d="M 40 140 L 100 120 L 160 110 L 220 100 L 280 95 L 340 90"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                  {/* Area under curve */}
                  <path
                    d="M 40 140 L 100 120 L 160 110 L 220 100 L 280 95 L 340 90 L 340 200 L 40 200 Z"
                    fill="url(#attendanceGradient)"
                  />
                  {/* Data points */}
                  {[
                    { x: 40, y: 140, value: 85 },
                    { x: 100, y: 120, value: 88 },
                    { x: 160, y: 110, value: 90 },
                    { x: 220, y: 100, value: 92 },
                    { x: 280, y: 95, value: 94 },
                    { x: 340, y: 90, value: 95 },
                  ].map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        fill="rgb(59, 130, 246)"
                        className="hover:r-7 transition-all cursor-pointer"
                      />
                      <text
                        x={point.x}
                        y={point.y - 10}
                        textAnchor="middle"
                        className="text-xs fill-gray-600 dark:fill-gray-400 font-medium"
                      >
                        {point.value}%
                      </text>
                    </g>
                  ))}
                </svg>
                {/* Month labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 text-xs text-muted-foreground">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between pl-2 text-xs text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
