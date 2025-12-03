"use server"

// Static mock data for roles and permissions
let staticRoles = [
  {
    id: "role-1",
    name: "Admin",
    userCount: 1,
    permissions: {
      dashboard: { view: true, create: true, update: true, delete: true, approve: true },
      students: { view: true, create: true, update: true, delete: true, approve: true },
      teachers: { view: true, create: true, update: true, delete: true, approve: true },
      enrollment: { view: true, create: true, update: true, delete: true, approve: true },
      attendance: { view: true, create: true, update: true, delete: true, approve: true },
      fees: { view: true, create: true, update: true, delete: true, approve: true },
      sports: { view: true, create: true, update: true, delete: true, approve: true },
      results: { view: true, create: true, update: true, delete: true, approve: true },
      reports: { view: true, create: true, update: true, delete: true, approve: true },
      settings: { view: true, create: true, update: true, delete: true, approve: true },
      profile: { view: true, create: true, update: true, delete: true, approve: true },
    },
  },
  {
    id: "role-2",
    name: "Teacher",
    userCount: 5,
    permissions: {
      dashboard: { view: true, create: false, update: false, delete: false, approve: false },
      students: { view: true, create: false, update: false, delete: false, approve: false },
      teachers: { view: false, create: false, update: false, delete: false, approve: false },
      enrollment: { view: false, create: false, update: false, delete: false, approve: false },
      attendance: { view: true, create: true, update: true, delete: false, approve: false },
      fees: { view: false, create: false, update: false, delete: false, approve: false },
      sports: { view: true, create: true, update: true, delete: false, approve: false },
      results: { view: true, create: true, update: true, delete: false, approve: true },
      reports: { view: false, create: false, update: false, delete: false, approve: false },
      settings: { view: false, create: false, update: false, delete: false, approve: false },
      profile: { view: true, create: false, update: true, delete: false, approve: false },
    },
  },
  {
    id: "role-3",
    name: "Student",
    userCount: 8,
    permissions: {
      dashboard: { view: true, create: false, update: false, delete: false, approve: false },
      students: { view: false, create: false, update: false, delete: false, approve: false },
      teachers: { view: false, create: false, update: false, delete: false, approve: false },
      enrollment: { view: false, create: false, update: false, delete: false, approve: false },
      attendance: { view: true, create: false, update: false, delete: false, approve: false },
      fees: { view: true, create: false, update: false, delete: false, approve: false },
      sports: { view: true, create: false, update: false, delete: false, approve: false },
      results: { view: true, create: false, update: false, delete: false, approve: false },
      reports: { view: false, create: false, update: false, delete: false, approve: false },
      settings: { view: false, create: false, update: false, delete: false, approve: false },
      profile: { view: true, create: false, update: true, delete: false, approve: false },
    },
  },
]

export async function getAllRoles() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return staticRoles.map(({ permissions, ...role }) => role)
}

export async function getRolePermissions(roleId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const role = staticRoles.find((r) => r.id === roleId)
  return role ? role.permissions : null
}

export async function getRoleTemplate(roleId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const role = staticRoles.find((r) => r.id === roleId)
  return role ? role.permissions : null
}

export async function createRole(name: string, permissions: Record<string, Record<string, boolean>>) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newRole = {
    id: `role-${staticRoles.length + 1}`,
    name,
    userCount: 0,
    permissions,
  }
  staticRoles.push(newRole)
  return newRole
}

export async function updateRole(
  roleId: string,
  name: string,
  permissions: Record<string, Record<string, boolean>>
) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const roleIndex = staticRoles.findIndex((r) => r.id === roleId)
  if (roleIndex === -1) {
    throw new Error("Role not found")
  }
  staticRoles[roleIndex] = {
    ...staticRoles[roleIndex],
    name,
    permissions,
  }
  return staticRoles[roleIndex]
}

export async function deleteRole(roleId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const roleIndex = staticRoles.findIndex((r) => r.id === roleId)
  if (roleIndex === -1) {
    throw new Error("Role not found")
  }
  const role = staticRoles[roleIndex]
  if (role.name === "Admin" || role.name === "admin") {
    throw new Error("Cannot delete admin role")
  }
  staticRoles.splice(roleIndex, 1)
  return { success: true }
}

