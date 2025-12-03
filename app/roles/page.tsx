"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SafeSidebarTrigger } from "@/components/safe-sidebar-trigger"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getAllRoles, getRolePermissions, createRole, updateRole, deleteRole, getRoleTemplate } from "./actions"

// Page resources based on the school management system
const PAGE_RESOURCES = [
  { id: "dashboard", name: "Dashboard" },
  { id: "students", name: "Students" },
  { id: "teachers", name: "Teachers" },
  { id: "enrollment", name: "Enrollment" },
  { id: "attendance", name: "Attendance" },
  { id: "fees", name: "Fees" },
  { id: "sports", name: "Sports" },
  { id: "results", name: "Results" },
  { id: "reports", name: "Reports" },
  { id: "settings", name: "Settings" },
  { id: "profile", name: "Profile" },
]

// Permission types
const PERMISSION_TYPES = [
  { id: "view", name: "View/List" },
  { id: "create", name: "Add/Create" },
  { id: "update", name: "Edit/Update" },
  { id: "delete", name: "Delete/Remove" },
  { id: "approve", name: "Approve/Publish" },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [roleName, setRoleName] = useState("")
  const [templateRole, setTemplateRole] = useState("")
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadRoles()
  }, [])

  useEffect(() => {
    if (templateRole && templateRole !== "none") {
      loadTemplatePermissions(templateRole)
    } else if (templateRole === "none" || !templateRole) {
      // Clear template if "none" is selected
      initializePermissions()
    }
  }, [templateRole])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const data = await getAllRoles()
      setRoles(data)
    } catch (error) {
      console.error("Error loading roles:", error)
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTemplatePermissions = async (roleId: string) => {
    try {
      const templatePerms = await getRoleTemplate(roleId)
      if (templatePerms) {
        setPermissions(templatePerms)
      }
    } catch (error) {
      console.error("Error loading template:", error)
    }
  }

  const loadRolePermissions = async (roleId: string) => {
    try {
      setLoading(true)
      const rolePerms = await getRolePermissions(roleId)
      if (rolePerms) {
        setPermissions(rolePerms)
      } else {
        // Initialize empty permissions
        initializePermissions()
      }
    } catch (error) {
      console.error("Error loading permissions:", error)
      initializePermissions()
    } finally {
      setLoading(false)
    }
  }

  const initializePermissions = () => {
    const newPermissions: Record<string, Record<string, boolean>> = {}
    PAGE_RESOURCES.forEach((resource) => {
      newPermissions[resource.id] = {}
      PERMISSION_TYPES.forEach((perm) => {
        newPermissions[resource.id][perm.id] = false
      })
    })
    setPermissions(newPermissions)
  }

  const handleRoleSelect = (roleId: string) => {
    if (roleId === "new") {
      setSelectedRole("")
      setRoleName("")
      setIsEditing(false)
      initializePermissions()
      setTemplateRole("")
    } else {
      setSelectedRole(roleId)
      const role = roles.find((r) => r.id === roleId)
      if (role) {
        setRoleName(role.name)
        setIsEditing(true)
        loadRolePermissions(roleId)
      }
    }
  }

  const handlePermissionChange = (resourceId: string, permissionId: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [permissionId]: checked,
      },
    }))
  }

  const handleSelectAllResource = (resourceId: string, checked: boolean) => {
    setPermissions((prev) => {
      const newPerms = { ...prev }
      newPerms[resourceId] = {}
      PERMISSION_TYPES.forEach((perm) => {
        newPerms[resourceId][perm.id] = checked
      })
      return newPerms
    })
  }

  const handleSelectAllPermissions = (checked: boolean) => {
    const newPermissions: Record<string, Record<string, boolean>> = {}
    PAGE_RESOURCES.forEach((resource) => {
      newPermissions[resource.id] = {}
      PERMISSION_TYPES.forEach((perm) => {
        newPermissions[resource.id][perm.id] = checked
      })
    })
    setPermissions(newPermissions)
  }

  const handleSave = async () => {
    if (!roleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      if (isEditing && selectedRole) {
        await updateRole(selectedRole, roleName, permissions)
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        await createRole(roleName, permissions)
        toast({
          title: "Success",
          description: "Role created successfully",
        })
        setRoleName("")
        initializePermissions()
        setTemplateRole("")
      }
      await loadRoles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      setLoading(true)
      await deleteRole(roleId)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      if (selectedRole === roleId) {
        setSelectedRole("")
        setRoleName("")
        setIsEditing(false)
        initializePermissions()
      }
      await loadRoles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isResourceAllSelected = (resourceId: string) => {
    const resourcePerms = permissions[resourceId] || {}
    return PERMISSION_TYPES.every((perm) => resourcePerms[perm.id] === true)
  }

  const isAllSelected = () => {
    return PAGE_RESOURCES.every((resource) => isResourceAllSelected(resource.id))
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 shrink-0">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <SafeSidebarTrigger />
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <h1 className="text-xl font-bold">Roles & Permissions</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Role</CardTitle>
                <CardDescription>Choose an existing role to edit or create a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-select">Role</Label>
                    <Select value={selectedRole || "new"} onValueChange={handleRoleSelect}>
                      <SelectTrigger id="role-select">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">+ Create New Role</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Existing Role as Template */}
            <Card>
              <CardHeader>
                <CardTitle>Use Existing Role as a Template</CardTitle>
                <CardDescription>Copy permissions from an existing role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="template-role">Select a role</Label>
                  <Select value={templateRole || undefined} onValueChange={(value) => setTemplateRole(value === "none" ? "" : value)}>
                    <SelectTrigger id="template-role">
                      <SelectValue placeholder="Select a role to copy permissions from" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {roles
                        .filter((role) => role.id !== selectedRole)
                        .map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Permissions Matrix */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Permissions Matrix</CardTitle>
                    <CardDescription>Manage permissions for each page resource</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected()}
                      onCheckedChange={(checked) => handleSelectAllPermissions(checked === true)}
                    />
                    <Label htmlFor="select-all" className="cursor-pointer">
                      Select all
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] font-semibold">Page Resource</TableHead>
                        {PERMISSION_TYPES.map((perm) => (
                          <TableHead key={perm.id} className="text-center font-semibold">
                            {perm.name}
                          </TableHead>
                        ))}
                        <TableHead className="text-center font-semibold">All</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PAGE_RESOURCES.map((resource) => {
                        const resourcePerms = permissions[resource.id] || {}
                        const allSelected = isResourceAllSelected(resource.id)
                        return (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.name}</TableCell>
                            {PERMISSION_TYPES.map((perm) => (
                              <TableCell key={perm.id} className="text-center">
                                <Checkbox
                                  checked={resourcePerms[perm.id] === true}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(resource.id, perm.id, checked === true)
                                  }
                                />
                              </TableCell>
                            ))}
                            <TableCell className="text-center">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={(checked) =>
                                  handleSelectAllResource(resource.id, checked === true)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                setSelectedRole("")
                setRoleName("")
                setIsEditing(false)
                initializePermissions()
                setTemplateRole("")
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !roleName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Role" : "Save Role"}
              </Button>
            </div>

            {/* Existing Roles List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Roles</CardTitle>
                <CardDescription>Manage existing roles in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No roles found</p>
                  ) : (
                    roles.map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{role.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {role.userCount || 0} users assigned
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(role.id)}
                            disabled={role.name === "admin" || role.name === "Admin"}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

