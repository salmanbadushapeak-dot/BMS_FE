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
import { getAllFees, getAllStudents, createFee, updateFee, deleteFee } from "./actions"
import { PlusCircle, Search, Edit, Trash2, RefreshCw, DollarSign } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Fee {
  id: string
  student_id: string
  amount_due: number
  amount_paid: number
  due_date: string
  status: string
  payment_date?: string
  student_name?: string // Added for display purposes
}

interface Student {
  id: string
  first_name: string
  last_name: string
}

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentFee, setCurrentFee] = useState<Fee | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchFeesAndStudents()
  }, [])

  const fetchFeesAndStudents = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: feesData, error: feesError } = await getAllFees()
      if (feesError) throw new Error(feesError)

      const { data: studentsData, error: studentsError } = await getAllStudents()
      if (studentsError) throw new Error(studentsError)

      const feesWithStudentNames =
        feesData?.map((fee: Fee) => {
          const student = studentsData?.find((s: Student) => s.id === fee.student_id)
          return {
            ...fee,
            student_name: student ? `${student.first_name} ${student.last_name}` : "Unknown Student",
          }
        }) || []

      setFees(feesWithStudentNames)
      setStudents(studentsData || [])
    } catch (err: any) {
      console.error("Error fetching fees or students:", err)
      setError(err.message || "Failed to fetch fees data.")
      toast({
        title: "Error",
        description: err.message || "Failed to fetch fees data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFee = () => {
    setCurrentFee(null)
    setIsDialogOpen(true)
  }

  const handleEditFee = (fee: Fee) => {
    setCurrentFee(fee)
    setIsDialogOpen(true)
  }

  const handleDeleteFee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fee record?")) return

    try {
      await deleteFee(id)
      toast({
        title: "Success",
        description: "Fee record deleted successfully.",
      })
      fetchFeesAndStudents()
    } catch (err: any) {
      console.error("Error deleting fee record:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete fee record.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const feeData: Partial<Fee> = {
      student_id: formData.get("student_id") as string,
      amount_due: Number.parseFloat(formData.get("amount_due") as string),
      amount_paid: Number.parseFloat(formData.get("amount_paid") as string),
      due_date: formData.get("due_date") as string,
      status: formData.get("status") as string,
      payment_date: formData.get("payment_date") as string,
    }

    try {
      if (currentFee) {
        await updateFee(currentFee.id, feeData)
        toast({
          title: "Success",
          description: "Fee record updated successfully.",
        })
      } else {
        await createFee(feeData)
        toast({
          title: "Success",
          description: "Fee record added successfully.",
        })
      }
      setIsDialogOpen(false)
      fetchFeesAndStudents()
    } catch (err: any) {
      console.error("Error saving fee record:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to save fee record.",
        variant: "destructive",
      })
    }
  }

  const filteredFees = fees.filter(
    (fee) =>
      fee.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const feesStats = {
    totalAmountDue: fees.reduce((sum, fee) => sum + fee.amount_due, 0),
    totalAmountPaid: fees.reduce((sum, fee) => sum + fee.amount_paid, 0),
    totalPending: fees.reduce((sum, fee) => sum + (fee.amount_due - fee.amount_paid), 0),
    paidStudents: new Set(fees.filter((fee) => fee.status === "Paid").map((f) => f.student_id)).size,
    pendingStudents: new Set(fees.filter((fee) => fee.status !== "Paid").map((f) => f.student_id)).size,
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{feesStats.totalAmountDue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all records</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{feesStats.totalAmountPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Collected so far</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{feesStats.totalPending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{feesStats.pendingStudents} students with pending fees</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fee Management</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fees..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddFee}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Fee Record
              </Button>
              <Button variant="outline" onClick={fetchFeesAndStudents} disabled={loading}>
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
            ) : filteredFees.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">No fee records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.student_name}</TableCell>
                        <TableCell>₹{fee.amount_due.toLocaleString()}</TableCell>
                        <TableCell>₹{fee.amount_paid.toLocaleString()}</TableCell>
                        <TableCell>{fee.due_date}</TableCell>
                        <TableCell>{fee.status}</TableCell>
                        <TableCell>{fee.payment_date || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditFee(fee)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteFee(fee.id)}>
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
              <DialogTitle>{currentFee ? "Edit Fee Record" : "Add New Fee Record"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student</Label>
                <Select name="student_id" defaultValue={currentFee?.student_id || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount_due">Amount Due</Label>
                  <Input
                    id="amount_due"
                    name="amount_due"
                    type="number"
                    step="0.01"
                    defaultValue={currentFee?.amount_due || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount_paid">Amount Paid</Label>
                  <Input
                    id="amount_paid"
                    name="amount_paid"
                    type="number"
                    step="0.01"
                    defaultValue={currentFee?.amount_paid || ""}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input id="due_date" name="due_date" type="date" defaultValue={currentFee?.due_date || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={currentFee?.status || "Pending"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_date">Payment Date (Optional)</Label>
                <Input
                  id="payment_date"
                  name="payment_date"
                  type="date"
                  defaultValue={currentFee?.payment_date || ""}
                />
              </div>
              <DialogFooter>
                <Button type="submit">{currentFee ? "Save Changes" : "Add Fee Record"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
