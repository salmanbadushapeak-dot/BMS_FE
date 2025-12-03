"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Download, TrendingUp, Users, GraduationCap, Calendar } from "lucide-react"

export default function ReportsPage() {
  const attendanceData = [
    { month: "Jan", attendance: 94 },
    { month: "Feb", attendance: 92 },
    { month: "Mar", attendance: 96 },
    { month: "Apr", attendance: 89 },
    { month: "May", attendance: 93 },
    { month: "Jun", attendance: 95 },
  ]

  const gradeDistribution = [
    { grade: "A+", count: 45, color: "#22c55e" },
    { grade: "A", count: 78, color: "#3b82f6" },
    { grade: "B+", count: 92, color: "#f59e0b" },
    { grade: "B", count: 67, color: "#ef4444" },
    { grade: "C", count: 23, color: "#8b5cf6" },
  ]

  const feesCollection = [
    { month: "Jan", collected: 450000, pending: 50000 },
    { month: "Feb", collected: 480000, pending: 45000 },
    { month: "Mar", collected: 520000, pending: 30000 },
    { month: "Apr", collected: 495000, pending: 35000 },
    { month: "May", collected: 510000, pending: 25000 },
    { month: "Jun", collected: 535000, pending: 20000 },
  ]

  const sportsParticipation = [
    { sport: "Basketball", participants: 45 },
    { sport: "Football", participants: 52 },
    { sport: "Cricket", participants: 38 },
    { sport: "Tennis", participants: 28 },
    { sport: "Swimming", participants: 35 },
    { sport: "Athletics", participants: 42 },
  ]

  const overallStats = {
    totalStudents: 1247,
    averageAttendance: 93.2,
    feesCollectionRate: 89.5,
    sportsParticipation: 67.8,
    academicPerformance: 85.4,
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive reports and data analytics</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageAttendance}%</div>
            <Progress value={overallStats.averageAttendance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.feesCollectionRate}%</div>
            <Progress value={overallStats.feesCollectionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sports Participation</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.sportsParticipation}%</div>
            <Progress value={overallStats.sportsParticipation} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.academicPerformance}%</div>
            <Progress value={overallStats.academicPerformance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All Reports
          </Button>
        </div>

        <TabsContent value="attendance">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Attendance percentage over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Current month attendance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Present Students</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">1,156</Badge>
                    <span className="text-sm text-muted-foreground">92.7%</span>
                  </div>
                </div>
                <Progress value={92.7} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Absent Students</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">67</Badge>
                    <span className="text-sm text-muted-foreground">5.4%</span>
                  </div>
                </div>
                <Progress value={5.4} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Late Arrivals</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">24</Badge>
                    <span className="text-sm text-muted-foreground">1.9%</span>
                  </div>
                </div>
                <Progress value={1.9} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, count }) => `${grade}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Subject-wise performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mathematics</span>
                    <span className="text-sm text-muted-foreground">87.5%</span>
                  </div>
                  <Progress value={87.5} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Science</span>
                    <span className="text-sm text-muted-foreground">84.2%</span>
                  </div>
                  <Progress value={84.2} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">English</span>
                    <span className="text-sm text-muted-foreground">89.1%</span>
                  </div>
                  <Progress value={89.1} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">History</span>
                    <span className="text-sm text-muted-foreground">82.7%</span>
                  </div>
                  <Progress value={82.7} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Geography</span>
                    <span className="text-sm text-muted-foreground">85.9%</span>
                  </div>
                  <Progress value={85.9} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Fees Collection Trend</CardTitle>
                <CardDescription>Monthly fees collection vs pending amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={feesCollection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="collected" fill="#22c55e" name="Collected" />
                    <Bar dataKey="pending" fill="#ef4444" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹29,90,000</div>
                  <p className="text-sm text-muted-foreground">This academic year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">₹2,05,000</div>
                  <p className="text-sm text-muted-foreground">Outstanding fees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">93.6%</div>
                  <Progress value={93.6} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sports Participation</CardTitle>
                <CardDescription>Number of students participating in each sport</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sportsParticipation} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="sport" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sports Achievements</CardTitle>
                <CardDescription>Recent achievements and awards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="default">🏆</Badge>
                  <div>
                    <p className="font-medium">Inter-school Basketball Championship</p>
                    <p className="text-sm text-muted-foreground">1st Place - January 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary">🥈</Badge>
                  <div>
                    <p className="font-medium">Regional Football Tournament</p>
                    <p className="text-sm text-muted-foreground">2nd Place - December 2023</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="default">🏆</Badge>
                  <div>
                    <p className="font-medium">District Swimming Championship</p>
                    <p className="text-sm text-muted-foreground">1st Place - November 2023</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary">🥉</Badge>
                  <div>
                    <p className="font-medium">State Level Cricket Tournament</p>
                    <p className="text-sm text-muted-foreground">3rd Place - October 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
