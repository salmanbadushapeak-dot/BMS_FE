"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllStudents, createStudent, updateStudent, deleteStudent } from "./actions";
import { PlusCircle, Search, Edit, Trash2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Student {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  grade: string
  contact_number: string
  email: string
  address: string
  enrollment_date: string
  status: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllStudents()
      setStudents(data || [])
    } catch (err: any) {
      console.error("Error fetching students:", err)
      setError(err.message || "Failed to fetch students.")
      toast({
        title: "Error",
        description: err.message || "Failed to fetch students.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = () => {
    setCurrentStudent(null)
    setIsDialogOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setCurrentStudent(student)
    setIsDialogOpen(true)
  }

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      await deleteStudent(id)
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      })
      fetchStudents()
    } catch (err: any) {
      console.error("Error deleting student:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete student.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const studentData: Partial<Student> = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      gender: formData.get("gender") as string,
      grade: formData.get("grade") as string,
      contact_number: formData.get("contact_number") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      enrollment_date: formData.get("enrollment_date") as string,
      status: formData.get("status") as string,
    }

    try {
      if (currentStudent) {
        await updateStudent(currentStudent.id, studentData)
        toast({
          title: "Success",
          description: "Student updated successfully.",
        })
      } else {
        await createStudent(studentData)
        toast({
          title: "Success",
          description: "Student added successfully.",
        })
      }
      setIsDialogOpen(false)
      fetchStudents()
    } catch (err: any) {
      console.error("Error saving student:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to save student.",
        variant: "destructive",
      })
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 p-4 md:p-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Student Management</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddStudent}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Student
              </Button>
              <Button variant="outline" onClick={fetchStudents} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-8">{error}</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">No students found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.contact_number}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStudent(student)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" defaultValue={currentStudent?.first_name || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" defaultValue={currentStudent?.last_name || ""} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={currentStudent?.date_of_birth || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue={currentStudent?.gender || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" name="grade" defaultValue={currentStudent?.grade || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    defaultValue={currentStudent?.contact_number || ""}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={currentStudent?.email || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={currentStudent?.address || ""} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollment_date">Enrollment Date</Label>
                  <Input
                    id="enrollment_date"
                    name="enrollment_date"
                    type="date"
                    defaultValue={currentStudent?.enrollment_date || new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={currentStudent?.status || "Active"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{currentStudent ? "Save Changes" : "Add Student"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
