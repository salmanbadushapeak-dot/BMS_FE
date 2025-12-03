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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GraduationCap, Loader2, Shield, BookOpen, Users, CheckCircle, Copy, Eye, EyeOff } from "lucide-react"
import { useAuth } from "./auth-provider"
import { USER_CREDENTIALS } from "@/lib/credentials"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginStep, setLoginStep] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
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

      const creds = USER_CREDENTIALS[role as keyof typeof USER_CREDENTIALS]
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

                {/* Credentials Reference */}
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📋 Available Credentials:</p>
                  <div className="space-y-2">
                    {Object.entries(USER_CREDENTIALS).map(([role, creds]) => (
                      <div
                        key={role}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">{role}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{creds.email}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setEmail(creds.email)
                            setPassword(creds.password)
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-primary hover:underline"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter your password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 text-center">
                🔑 User Credentials
              </p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-900">
                  <p className="font-medium text-red-600 dark:text-red-400">👑 Admin</p>
                  <p className="text-gray-600 dark:text-gray-400">Email: {USER_CREDENTIALS.admin.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">Password: {USER_CREDENTIALS.admin.password}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-900">
                  <p className="font-medium text-blue-600 dark:text-blue-400">📚 Teacher</p>
                  <p className="text-gray-600 dark:text-gray-400">Email: {USER_CREDENTIALS.teacher.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">Password: {USER_CREDENTIALS.teacher.password}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-900">
                  <p className="font-medium text-green-600 dark:text-green-400">👤 Student</p>
                  <p className="text-gray-600 dark:text-gray-400">Email: {USER_CREDENTIALS.student.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">Password: {USER_CREDENTIALS.student.password}</p>
                </div>
              </div>
              <p className="text-xs text-center text-blue-700 dark:text-blue-300 mt-2">
                These credentials work without database setup
              </p>
            </div>
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

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // For demo purposes, just show a success message
              setSuccess("Password reset link sent! (Demo mode - no email sent)")
              setShowForgotPassword(false)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                required
                defaultValue={email}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Reset Link</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
