"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Database, Globe, Copy, ExternalLink, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EnvSetup() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const createTablesSQL = `-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    section VARCHAR(10) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    guardian_name VARCHAR(200) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_email VARCHAR(255),
    previous_school VARCHAR(200),
    medical_conditions TEXT,
    admission_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Graduated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create other tables...
-- (See the full script in scripts/create-tables-v2.sql)`

  const sampleDataSQL = `-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, grade, section, roll_no, address, guardian_name, guardian_phone, guardian_email, admission_date, status) VALUES
('STU001', 'John', 'Doe', 'john.doe@email.com', '1234567890', '2010-05-15', 'male', '8', 'A', '001', '123 Main St, City', 'Robert Doe', '9876543210', 'robert.doe@email.com', '2023-04-01', 'Active'),
('STU002', 'Jane', 'Smith', 'jane.smith@email.com', '1234567891', '2009-08-22', 'female', '9', 'B', '002', '456 Oak Ave, City', 'Mary Smith', '9876543211', 'mary.smith@email.com', '2023-04-01', 'Active');

-- Insert more sample data...
-- (See the full script in scripts/seed-sample-data.sql)`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup Required
          </CardTitle>
          <CardDescription>Complete these steps to set up your school management system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="supabase">Supabase</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="complete">Complete</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your school management system needs a database to store student, teacher, and other school data. We'll
                  use Supabase as your database backend.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Student Management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Teacher Management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Attendance Tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Fee Management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Sports & Events
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Exam Results
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Setup Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">1</Badge>
                        Create Supabase account
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">2</Badge>
                        Get your project credentials
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">3</Badge>
                        Set environment variables
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">4</Badge>
                        Run database scripts
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={() => setActiveTab("supabase")} className="w-full">
                Get Started
              </Button>
            </TabsContent>

            <TabsContent value="supabase" className="space-y-4">
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Supabase provides a free PostgreSQL database that's perfect for this application.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Step 1: Create Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">Sign up for a free Supabase account</p>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => window.open("https://supabase.com", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Go to Supabase
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Step 2: Create Project</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">Create a new project in your dashboard</p>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Step 3: Get Your Credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Go to your project dashboard</li>
                      <li>Click on "Settings" in the sidebar</li>
                      <li>Click on "API" in the settings menu</li>
                      <li>Copy your "Project URL" and "anon public" key</li>
                    </ol>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Project URL</Label>
                        <Input placeholder="https://your-project.supabase.co" />
                      </div>
                      <div className="space-y-2">
                        <Label>Anon Key</Label>
                        <Input placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." type="password" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => setActiveTab("database")} className="w-full">
                  Continue to Database Setup
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertDescription>
                  Run these SQL scripts in your Supabase SQL Editor to create the database tables.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Environment Variables</CardTitle>
                    <CardDescription>First, add these to your .env.local file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_SUPABASE_URL=your_project_url</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_URL=your_project_url")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SQL Scripts</CardTitle>
                    <CardDescription>Run these in your Supabase SQL Editor</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">1. Create Tables Script</h4>
                          <p className="text-sm text-gray-600">Creates all database tables</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(createTablesSQL)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">2. Sample Data Script</h4>
                          <p className="text-sm text-gray-600">Adds sample students and teachers</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(sampleDataSQL)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Make sure to run the "Create Tables" script first, then the "Sample Data" script.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Button onClick={() => setActiveTab("complete")} className="w-full">
                  I've Run the Scripts
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="complete" className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Great! Your database should now be set up. Restart your application to see the changes.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Restart your development server</li>
                    <li>Refresh this page</li>
                    <li>You should now see the full application</li>
                    <li>Use the sample login credentials to test</li>
                  </ol>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Login Credentials:</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Admin:</strong> admin@school.edu
                      </div>
                      <div>
                        <strong>Teacher:</strong> emily.davis@school.edu
                      </div>
                      <div>
                        <strong>Student:</strong> john.doe@email.com
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => window.location.reload()} className="w-full">
                Restart Application
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
