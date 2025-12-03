"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "./auth/auth-provider"
import { LogOut, Settings, User, Shield, BookOpen, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  const initials = user.profile
    ? `${user.profile.first_name[0]}${user.profile.last_name[0]}`
    : user.email[0].toUpperCase()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "teacher":
        return <BookOpen className="h-3 w-3" />
      case "student":
        return <Users className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "teacher":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "student":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} alt={user.email} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user.email}
              </p>
              <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                <span className="flex items-center gap-1">
                  {getRoleIcon(user.role)}
                  {user.role}
                </span>
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.email.includes("@school.com") && (
              <p className="text-xs leading-none text-blue-600 font-medium">Demo Account</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => {
          await signOut()
          // Redirect to home - ProtectedRoute will show login form
          router.push("/")
          router.refresh()
        }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
