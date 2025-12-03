"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Home,
  Search,
  Settings,
  Users,
  BookOpen,
  DollarSign,
  Trophy,
  ClipboardList,
  UserCog,
  LogOut,
  Plus,
  Shield,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

// Dummy user data for demonstration
const currentUser = {
  name: "Admin User",
  email: "admin@example.com",
  role: "admin", // Can be 'admin', 'teacher', 'student'
}

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    roles: ["admin", "teacher"],
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    title: "Enrollment",
    href: "/enrollment",
    icon: Plus,
    roles: ["admin"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Calendar,
    roles: ["admin", "teacher"],
  },
  {
    title: "Fees",
    href: "/fees",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    title: "Sports",
    href: "/sports",
    icon: Trophy,
    roles: ["admin", "teacher"],
  },
  {
    title: "Results",
    href: "/results",
    icon: ClipboardList,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Search,
    roles: ["admin"],
  },
]

const settingsItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: UserCog,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Roles & Permissions",
    href: "/roles",
    icon: Shield,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()
  const { signOut, user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to log out.",
        variant: "destructive",
      })
    }
  }

  // Use actual user role from context, fallback to dummy data
  const effectiveUserRole = user?.role || currentUser.role
  
  const filteredNavItems = navItems.filter((item) => item.roles.includes(effectiveUserRole))
  const filteredSettingsItems = settingsItems.filter((item) => item.roles.includes(effectiveUserRole))

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
          <span className="text-lg">EduManage</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSettingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
