"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Loader2, Shield, BookOpen, Users, CheckCircle } from "lucide-react"
import { useAuth } from "./auth-provider"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginStep, setLoginStep] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await signIn(email, password)
      setSuccess("Login successful! Redirecting...")
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: string) => {
    setDemoLoading(role)
    setError("")
    setSuccess("")
    setLoginStep("")

    try {
      // Show login steps based on role
      if (role === "admin") {
        setLoginStep("🔐 Authenticating admin credentials...")
        await new Promise((resolve) => setTimeout(resolve, 800))

        setLoginStep("👑 Granting full system access...")
        await new Promise((resolve) => setTimeout(resolve, 600))

        setLoginStep("🎯 Loading admin dashboard...")
        await new Promise((resolve) => setTimeout(resolve, 400))
      } else if (role === "teacher") {
        setLoginStep("🔐 Authenticating teacher credentials...")
        await new Promise((resolve) => setTimeout(resolve, 800))

        setLoginStep("📚 Granting educational access...")
        await new Promise((resolve) => setTimeout(resolve, 600))

        setLoginStep("🚫 Restricting enrollment & fees access...")
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLoginStep("🎯 Loading teacher dashboard...")
        await new Promise((resolve) => setTimeout(resolve, 400))
      } else if (role === "student") {
        setLoginStep("🔐 Authenticating student credentials...")
        await new Promise((resolve) => setTimeout(resolve, 600))

        setLoginStep("👤 Loading personal dashboard...")
        await new Promise((resolve) => setTimeout(resolve, 400))
      }

      const demoCredentials = {
        admin: { email: "admin@school.com", password: "admin123" },
        teacher: { email: "teacher@school.com", password: "teacher123" },
        student: { email: "student@school.com", password: "student123" },
      }

      const creds = demoCredentials[role as keyof typeof demoCredentials]
      await signIn(creds.email, creds.password)

      setSuccess(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`)
      setLoginStep("🚀 Redirecting...")

      // Redirect based on role so that teacher/student don't hit the admin-only dashboard
      const redirectPath =
        role === "admin" ? "/" : role === "teacher" ? "/teachers" : "/students"

      setTimeout(() => {
        router.push(redirectPath)
        router.refresh()
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Demo login failed")
      setLoginStep("")
    } finally {
      setDemoLoading(null)
    }
  }

  const demoRoles = [
    {
      role: "admin",
      label: "Admin Demo",
      description: "Full access to all features",
      icon: Shield,
      color: "bg-red-50 hover:bg-red-100 border-red-200 text-red-700",
      features: ["👥 Student Management", "💰 Fees Management", "📊 Full Reports", "⚙️ System Settings"],
    },
    {
      role: "teacher",
      label: "Teacher Demo",
      description: "Educational access - No financial/enrollment",
      icon: BookOpen,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
      features: ["👥 View Students", "✅ Mark Attendance", "📝 Enter Results", "🚫 No Enrollment", "🚫 No Fees"],
      restrictions: ["Cannot add new students", "Cannot manage fees", "Limited admin tools"],
    },
    {
      role: "student",
      label: "Student Demo",
      description: "Limited access to own data",
      icon: Users,
      color: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
      features: ["👤 View Profile", "📅 Check Attendance", "📊 View Results", "🏆 Sports Info"],
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">EduManage</h1>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo Login</TabsTrigger>
              <TabsTrigger value="login">Manual Login</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {loginStep && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loginStep}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Try different user roles to explore the system:
                </p>

                {demoRoles.map(({ role, label, description, icon: Icon, color, features, restrictions }) => (
                  <div key={role} className="space-y-2">
                    <Button
                      variant="outline"
                      className={`w-full h-auto p-4 justify-start ${color} ${demoLoading === role ? "opacity-75" : ""}`}
                      onClick={() => handleDemoLogin(role)}
                      disabled={demoLoading !== null}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="text-left flex-1">
                          <div className="font-medium">{label}</div>
                          <div className="text-xs opacity-75">{description}</div>
                        </div>
                        {demoLoading === role && <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />}
                      </div>
                    </Button>

                    {role === "teacher" && (
                      <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-1">
                        <p className="text-xs font-medium text-blue-700">Teacher Features:</p>
                        {features.map((feature, index) => (
                          <p key={index} className="text-xs text-blue-600">
                            {feature}
                          </p>
                        ))}
                        {restrictions && (
                          <div className="mt-2 pt-1 border-t border-blue-100">
                            <p className="text-xs font-medium text-red-600">Restrictions:</p>
                            {restrictions.map((restriction, index) => (
                              <p key={index} className="text-xs text-red-500">
                                🚫 {restriction}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {role === "admin" && (
                      <div className="ml-4 pl-4 border-l-2 border-red-200 space-y-1">
                        <p className="text-xs font-medium text-red-700">Admin Features:</p>
                        {features.map((feature, index) => (
                          <p key={index} className="text-xs text-red-600">
                            {feature}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>💡 Try Admin First:</strong> Login as admin to see all menu items and full system access, then
                  try other roles to see how permissions change.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">Demo credentials work without database setup</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-blue-800">🔄 Role Comparison:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-red-100 p-2 rounded">
                <p className="font-medium text-red-700">Admin</p>
                <p className="text-red-600">All Features ✅</p>
              </div>
              <div className="bg-blue-100 p-2 rounded">
                <p className="font-medium text-blue-700">Teacher</p>
                <p className="text-blue-600">No Enrollment/Fees 🚫</p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <p className="font-medium text-green-700">Student</p>
                <p className="text-green-600">View Only 👁️</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>💡 Try Teacher Next:</strong> Login as teacher to see restricted access - notice how Enrollment
              and Fees Management are hidden from the sidebar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
