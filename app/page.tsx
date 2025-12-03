"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
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
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Hero Section */}
          <section className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              src="/placeholder.svg?height=400&width=1200"
              alt="School Campus"
              layout="fill"
              objectFit="cover"
              className="z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-purple-800/70 flex items-center justify-center p-4 z-10">
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
                {/* Placeholder for actual chart */}
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-muted-foreground">
                  <p>Bar Chart Placeholder</p>
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
              {/* Placeholder for actual chart */}
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-muted-foreground">
                <p>Line Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
