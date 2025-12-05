"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createStudent, createTeacher } from "./actions"
import { toast } from "@/hooks/use-toast"
import { Loader2, UserPlus, GraduationCap } from "lucide-react"
import { SafeSidebarTrigger } from "@/components/safe-sidebar-trigger"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default function EnrollmentPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")

  const handleStudentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const newStudent = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      gender: formData.get("gender") as string,
      grade: formData.get("grade") as string,
      contact_number: formData.get("contact_number") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      enrollment_date: formData.get("enrollment_date") as string,
      status: "Active",
    }

    try {
      const result = await createStudent(newStudent)
      toast({
        title: "Success",
        description: `Student enrolled successfully! Login credentials have been sent to ${newStudent.email}`,
      })
      event.currentTarget.reset()
    } catch (error: any) {
      console.error("Error enrolling student:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to enroll student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTeacherSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const newTeacher = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      gender: formData.get("gender") as string,
      subject: formData.get("subject") as string,
      qualification: formData.get("qualification") as string,
      experience_years: parseInt(formData.get("experience_years") as string) || 0,
      address: formData.get("address") as string,
      emergency_contact: formData.get("emergency_contact") as string,
      joining_date: formData.get("joining_date") as string,
      salary: parseFloat(formData.get("salary") as string) || 0,
      status: "Active",
    }

    try {
      const result = await createTeacher(newTeacher)
      toast({
        title: "Success",
        description: `Teacher enrolled successfully! Login credentials have been sent to ${newTeacher.email}`,
      })
      event.currentTarget.reset()
    } catch (error: any) {
      console.error("Error enrolling teacher:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to enroll teacher. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 shrink-0">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <SafeSidebarTrigger />
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <h1 className="text-xl font-bold">Enrollment</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student Enrollment
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Teacher Enrollment
              </TabsTrigger>
            </TabsList>

            {/* Student Enrollment Tab */}
            <TabsContent value="student">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Student Enrollment</CardTitle>
                  <CardDescription>Fill out the form below to enroll a new student. Login credentials will be sent to their email.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_first_name">First Name</Label>
                        <Input id="student_first_name" name="first_name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_last_name">Last Name</Label>
                        <Input id="student_last_name" name="last_name" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_date_of_birth">Date of Birth</Label>
                        <Input id="student_date_of_birth" name="date_of_birth" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_gender">Gender</Label>
                        <Select name="gender" required>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student_grade">Grade</Label>
                        <Input id="student_grade" name="grade" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student_contact_number">Contact Number</Label>
                        <Input id="student_contact_number" name="contact_number" type="tel" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student_email">Email</Label>
                      <Input id="student_email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student_address">Address</Label>
                      <Input id="student_address" name="address" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student_enrollment_date">Enrollment Date</Label>
                      <Input
                        id="student_enrollment_date"
                        name="enrollment_date"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...
                        </>
                      ) : (
                        <>
                          <GraduationCap className="mr-2 h-4 w-4" /> Enroll Student
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teacher Enrollment Tab */}
            <TabsContent value="teacher">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Teacher Enrollment</CardTitle>
                  <CardDescription>Fill out the form below to enroll a new teacher. Login credentials will be sent to their email.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTeacherSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_first_name">First Name</Label>
                        <Input id="teacher_first_name" name="first_name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_last_name">Last Name</Label>
                        <Input id="teacher_last_name" name="last_name" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_email">Email</Label>
                        <Input id="teacher_email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_phone">Phone</Label>
                        <Input id="teacher_phone" name="phone" type="tel" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_date_of_birth">Date of Birth</Label>
                        <Input id="teacher_date_of_birth" name="date_of_birth" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_gender">Gender</Label>
                        <Select name="gender" required>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_subject">Subject</Label>
                        <Input id="teacher_subject" name="subject" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_qualification">Qualification</Label>
                        <Input id="teacher_qualification" name="qualification" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_experience_years">Experience (Years)</Label>
                        <Input id="teacher_experience_years" name="experience_years" type="number" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_salary">Salary</Label>
                        <Input id="teacher_salary" name="salary" type="number" min="0" step="0.01" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacher_address">Address</Label>
                      <Input id="teacher_address" name="address" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teacher_emergency_contact">Emergency Contact</Label>
                        <Input id="teacher_emergency_contact" name="emergency_contact" type="tel" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher_joining_date">Joining Date</Label>
                        <Input
                          id="teacher_joining_date"
                          name="joining_date"
                          type="date"
                          defaultValue={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" /> Enroll Teacher
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
