"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, Database, Key, Globe, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isSupabaseConfigured, testDatabaseConnection } from "@/lib/supabase"

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isTestingDb, setIsTestingDb] = useState(false)
  const { toast } = useToast()

  // Check if already configured on mount
  useEffect(() => {
    const checkExistingConfig = () => {
      if (isSupabaseConfigured()) {
        setStep(4) // Skip to completion if already configured
        toast({
          title: "Already Configured!",
          description: "Your Supabase configuration is already set up.",
        })
      }
    }

    checkExistingConfig()
  }, [toast])

  const handleValidateConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both Supabase URL and API key",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)

    try {
      // Basic URL validation
      const url = new URL(supabaseUrl)
      if (!url.hostname.includes("supabase")) {
        throw new Error("Invalid Supabase URL")
      }

      toast({
        title: "Connection Validated!",
        description: "Your Supabase credentials look correct. Please add them to your environment variables.",
      })
      setStep(2)
    } catch (error) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your Supabase URL format",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleTestDatabase = async () => {
    setIsTestingDb(true)
    try {
      const isConnected = await testDatabaseConnection()
      if (isConnected) {
        toast({
          title: "Database Connected!",
          description: "Your database tables are set up correctly.",
        })
        setStep(4)
      } else {
        toast({
          title: "Database Setup Required",
          description: "Please run the SQL scripts in your Supabase dashboard.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your environment variables and database setup.",
        variant: "destructive",
      })
    } finally {
      setIsTestingDb(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const handleRefreshPage = () => {
    window.location.reload()
  }

  const setupSteps = [
    {
      title: "Create Supabase Project",
      description: "Set up your database backend",
      completed: step > 1,
    },
    {
      title: "Configure Environment Variables",
      description: "Add your Supabase credentials",
      completed: step > 2,
    },
    {
      title: "Initialize Database",
      description: "Create tables and sample data",
      completed: step > 3,
    },
    {
      title: "Complete Setup",
      description: "Start using your school management system",
      completed: step >= 4,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">School Management System</h1>
          <p className="text-xl text-gray-600">Complete the setup to get started</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Setup Progress
            </CardTitle>
            <CardDescription>Follow these steps to configure your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupSteps.map((stepItem, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      stepItem.completed
                        ? "bg-green-500 text-white"
                        : step === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepItem.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{stepItem.title}</h3>
                    <p className="text-sm text-gray-600">{stepItem.description}</p>
                  </div>
                  {stepItem.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                  {step === index + 1 && <Badge variant="default">Current</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Supabase Setup */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Step 1: Create Supabase Project
              </CardTitle>
              <CardDescription>Create a new Supabase project to host your database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need a Supabase account to continue. Supabase provides a free tier that's perfect for getting
                  started.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supabase-url">Supabase Project URL</Label>
                    <Input
                      id="supabase-url"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                    <Input
                      id="supabase-key"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleValidateConnection} disabled={isValidating} className="flex-1">
                    {isValidating ? "Validating..." : "Validate Connection"}
                  </Button>
                  <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Supabase
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">How to get your Supabase credentials:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      supabase.com
                    </a>{" "}
                    and create an account
                  </li>
                  <li>Create a new project</li>
                  <li>Go to Settings → API in your project dashboard</li>
                  <li>Copy your Project URL and anon/public key</li>
                  <li>Paste them in the fields above</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Environment Variables */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Step 2: Configure Environment Variables
              </CardTitle>
              <CardDescription>Add your Supabase credentials to your environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Connection validated successfully! Now add these environment variables.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Environment Variables (.env.local)</Label>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg font-mono text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span>NEXT_PUBLIC_SUPABASE_URL={supabaseUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_SUPABASE_ANON_KEY={supabaseKey}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>
                      Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root
                    </li>
                    <li>Add the environment variables shown above</li>
                    <li>Restart your development server</li>
                    <li>Click "Check Configuration" below</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue to Database Setup
                  </Button>
                  <Button variant="outline" onClick={handleRefreshPage}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Database Setup */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Step 3: Initialize Database
              </CardTitle>
              <CardDescription>Create the required database tables and sample data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Run these SQL scripts in your Supabase SQL Editor to set up the database.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">SQL Scripts to Run:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">1. Create Tables</div>
                        <div className="text-sm text-gray-600">Creates all required database tables</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                      >
                        Open SQL Editor
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">2. Sample Data</div>
                        <div className="text-sm text-gray-600">Adds sample students, teachers, and other data</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Copy Script
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to SQL Editor</li>
                    <li>Run the "create-tables-v2.sql" script first</li>
                    <li>Then run the "seed-sample-data.sql" script</li>
                    <li>Click "Test Database Connection" below</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleTestDatabase} disabled={isTestingDb} className="flex-1">
                    {isTestingDb ? "Testing Connection..." : "Test Database Connection"}
                  </Button>
                  <Button variant="outline" onClick={() => setStep(4)}>
                    Skip Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Setup Complete!
              </CardTitle>
              <CardDescription>Your school management system is ready to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Congratulations! Your database is set up and ready. You can now start managing your school data.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Sample Data Included</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 5 Sample Students</li>
                    <li>• 5 Sample Teachers</li>
                    <li>• Fee Records</li>
                    <li>• Sports Teams & Events</li>
                    <li>• Exam Results</li>
                    <li>• Attendance Records</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Features Available</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Student Management</li>
                    <li>• Teacher Management</li>
                    <li>• Attendance Tracking</li>
                    <li>• Fee Management</li>
                    <li>• Sports Management</li>
                    <li>• Exam Results</li>
                  </ul>
                </div>
              </div>

              <Button onClick={handleRefreshPage} className="w-full" size="lg">
                Start Using School Management System
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
