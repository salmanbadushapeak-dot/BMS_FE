"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Download, BookOpen, TrendingUp, Award } from "lucide-react"

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("10") // Updated default value
  const [selectedExam, setSelectedExam] = useState("Mid-Term 2024") // Updated default value

  const examResults = [
    {
      id: "STU001",
      name: "John Doe",
      grade: "10th",
      section: "A",
      rollNo: "101",
      exam: "Mid-Term 2024",
      subjects: {
        Mathematics: { marks: 85, total: 100, grade: "A" },
        Science: { marks: 78, total: 100, grade: "B+" },
        English: { marks: 92, total: 100, grade: "A+" },
        History: { marks: 76, total: 100, grade: "B+" },
        Geography: { marks: 82, total: 100, grade: "A" },
      },
      totalMarks: 413,
      totalPossible: 500,
      percentage: 82.6,
      grade: "A",
      rank: 3,
    },
    {
      id: "STU002",
      name: "Sarah Wilson",
      grade: "10th",
      section: "A",
      rollNo: "102",
      exam: "Mid-Term 2024",
      subjects: {
        Mathematics: { marks: 95, total: 100, grade: "A+" },
        Science: { marks: 88, total: 100, grade: "A" },
        English: { marks: 89, total: 100, grade: "A" },
        History: { marks: 91, total: 100, grade: "A+" },
        Geography: { marks: 87, total: 100, grade: "A" },
      },
      totalMarks: 450,
      totalPossible: 500,
      percentage: 90.0,
      grade: "A+",
      rank: 1,
    },
    {
      id: "STU003",
      name: "Michael Brown",
      grade: "10th",
      section: "A",
      rollNo: "103",
      exam: "Mid-Term 2024",
      subjects: {
        Mathematics: { marks: 72, total: 100, grade: "B" },
        Science: { marks: 69, total: 100, grade: "B" },
        English: { marks: 75, total: 100, grade: "B+" },
        History: { marks: 68, total: 100, grade: "B" },
        Geography: { marks: 71, total: 100, grade: "B" },
      },
      totalMarks: 355,
      totalPossible: 500,
      percentage: 71.0,
      grade: "B",
      rank: 8,
    },
  ]

  const examList = [
    { id: "EXAM001", name: "Mid-Term 2024", date: "2024-01-15", status: "Completed" },
    { id: "EXAM002", name: "Final Exam 2024", date: "2024-03-15", status: "Upcoming" },
    { id: "EXAM003", name: "Unit Test 1", date: "2024-02-01", status: "Completed" },
  ]

  const subjectAnalysis = [
    { subject: "Mathematics", avgMarks: 84.0, highestMarks: 95, lowestMarks: 72, passRate: 100 },
    { subject: "Science", avgMarks: 78.3, highestMarks: 88, lowestMarks: 69, passRate: 100 },
    { subject: "English", avgMarks: 85.3, highestMarks: 92, lowestMarks: 75, passRate: 100 },
    { subject: "History", avgMarks: 78.3, highestMarks: 91, lowestMarks: 68, passRate: 100 },
    { subject: "Geography", avgMarks: 80.0, highestMarks: 87, lowestMarks: 71, passRate: 100 },
  ]

  const filteredResults = examResults.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      selectedGrade === "" ||
      student.grade.includes(selectedGrade) ||
      selectedExam === "" ||
      student.exam === selectedExam,
  )

  const resultsStats = {
    totalStudents: examResults.length,
    avgPercentage: examResults.reduce((sum, student) => sum + student.percentage, 0) / examResults.length,
    topPerformer: examResults.find((student) => student.rank === 1),
    passRate: (examResults.filter((student) => student.percentage >= 40).length / examResults.length) * 100,
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Results Management</h1>
          <p className="text-muted-foreground">Manage exam results and academic performance</p>
        </div>
      </div>

      {/* Results Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resultsStats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Percentage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resultsStats.avgPercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{resultsStats.topPerformer?.name}</div>
            <p className="text-xs text-muted-foreground">{resultsStats.topPerformer?.percentage}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resultsStats.passRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Management Tabs */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Student Results</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="analysis">Subject Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exam Results</CardTitle>
                  <CardDescription>View and manage student exam results</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Result
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Exam Result</DialogTitle>
                        <DialogDescription>Enter exam results for a student</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="student">Student</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select student" />
                              </SelectTrigger>
                              <SelectContent>
                                {examResults.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.name} - {student.rollNo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="exam">Exam</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exam" />
                              </SelectTrigger>
                              <SelectContent>
                                {examList.map((exam) => (
                                  <SelectItem key={exam.id} value={exam.id}>
                                    {exam.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium">Subject Marks</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="math">Mathematics</Label>
                              <Input id="math" type="number" placeholder="Marks out of 100" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="science">Science</Label>
                              <Input id="science" type="number" placeholder="Marks out of 100" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="english">English</Label>
                              <Input id="english" type="number" placeholder="Marks out of 100" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="history">History</Label>
                              <Input id="history" type="number" placeholder="Marks out of 100" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Result</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Exams" />
                  </SelectTrigger>
                  <SelectContent>
                    {examList.map((exam) => (
                      <SelectItem key={exam.id} value={exam.name}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.rollNo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.grade} {student.section}
                        </TableCell>
                        <TableCell>{student.exam}</TableCell>
                        <TableCell>
                          {student.totalMarks}/{student.totalPossible}
                        </TableCell>
                        <TableCell>{student.percentage}%</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.grade === "A+" || student.grade === "A"
                                ? "default"
                                : student.grade === "B+" || student.grade === "B"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>#{student.rank}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detailed Result - {student.name}</DialogTitle>
                                <DialogDescription>{student.exam} Results</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Total Marks</label>
                                    <p className="text-lg font-bold">
                                      {student.totalMarks}/{student.totalPossible}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Percentage</label>
                                    <p className="text-lg font-bold">{student.percentage}%</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Grade</label>
                                    <p className="text-lg font-bold">{student.grade}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Rank</label>
                                    <p className="text-lg font-bold">#{student.rank}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Subject-wise Performance</h4>
                                  <div className="space-y-2">
                                    {Object.entries(student.subjects).map(([subject, data]) => (
                                      <div
                                        key={subject}
                                        className="flex items-center justify-between p-2 border rounded"
                                      >
                                        <span className="font-medium">{subject}</span>
                                        <div className="flex items-center gap-4">
                                          <span>
                                            {data.marks}/{data.total}
                                          </span>
                                          <Badge variant="outline">{data.grade}</Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exam Schedule</CardTitle>
                  <CardDescription>Manage exam schedules and details</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Exam
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examList.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.name}</TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>
                          <Badge variant={exam.status === "Completed" ? "default" : "secondary"}>{exam.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance Analysis</CardTitle>
              <CardDescription>Analyze performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Average Marks</TableHead>
                      <TableHead>Highest Marks</TableHead>
                      <TableHead>Lowest Marks</TableHead>
                      <TableHead>Pass Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectAnalysis.map((subject) => (
                      <TableRow key={subject.subject}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.avgMarks.toFixed(1)}</TableCell>
                        <TableCell className="text-green-600">{subject.highestMarks}</TableCell>
                        <TableCell className="text-red-600">{subject.lowestMarks}</TableCell>
                        <TableCell>{subject.passRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
