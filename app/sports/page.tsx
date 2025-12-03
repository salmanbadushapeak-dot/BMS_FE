"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SafeSidebarTrigger } from "@/components/safe-sidebar-trigger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Plus, Medal, Target, Star, Award } from "lucide-react"
import Image from "next/image"

export default function SportsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const sportsTeams = [
    {
      id: "TEAM001",
      name: "Eagles Basketball",
      sport: "Basketball",
      coach: "Mr. Johnson",
      captain: "John Doe",
      members: 12,
      status: "Active",
      achievements: ["Inter-school Championship 2024", "District Level Winner"],
      image: "https://images.unsplash.com/photo-1519869325934-21c5bf0a0c4a?w=800&h=600&fit=crop",
      bgColor: "from-orange-500 to-red-600",
      description: "Our premier basketball team competing at state level",
    },
    {
      id: "TEAM002",
      name: "Lions Football",
      sport: "Football",
      coach: "Ms. Smith",
      captain: "Sarah Wilson",
      members: 15,
      status: "Active",
      achievements: ["Regional Tournament Runner-up"],
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
      bgColor: "from-green-500 to-emerald-600",
      description: "Competitive football team with excellent teamwork",
    },
    {
      id: "TEAM003",
      name: "Tigers Cricket",
      sport: "Cricket",
      coach: "Mr. Brown",
      captain: "Michael Brown",
      members: 11,
      status: "Active",
      achievements: ["State Level Qualifier"],
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop",
      bgColor: "from-blue-500 to-cyan-600",
      description: "Traditional cricket team with strong batting lineup",
    },
    {
      id: "TEAM004",
      name: "Sharks Swimming",
      sport: "Swimming",
      coach: "Ms. Davis",
      captain: "Emily Chen",
      members: 8,
      status: "Active",
      achievements: ["Regional Swimming Championship"],
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop",
      bgColor: "from-cyan-500 to-blue-600",
      description: "Elite swimming team with record-breaking performances",
    },
  ]

  const upcomingEvents = [
    {
      id: "EVENT001",
      name: "Inter-School Basketball Tournament",
      date: "2024-02-15",
      venue: "School Gymnasium",
      teams: ["Eagles Basketball"],
      status: "Upcoming",
      priority: "High",
    },
    {
      id: "EVENT002",
      name: "Annual Sports Day",
      date: "2024-02-20",
      venue: "School Ground",
      teams: ["All Teams"],
      status: "Upcoming",
      priority: "High",
    },
    {
      id: "EVENT003",
      name: "District Football Championship",
      date: "2024-02-25",
      venue: "District Stadium",
      teams: ["Lions Football"],
      status: "Upcoming",
      priority: "Medium",
    },
  ]

  const studentParticipation = [
    {
      id: "STU001",
      name: "John Doe",
      grade: "10th",
      section: "A",
      sports: ["Basketball", "Athletics"],
      position: "Captain",
      achievements: ["Best Player 2023", "MVP Award"],
    },
    {
      id: "STU002",
      name: "Sarah Wilson",
      grade: "9th",
      section: "B",
      sports: ["Football", "Swimming"],
      position: "Captain",
      achievements: ["MVP Award", "Leadership Excellence"],
    },
    {
      id: "STU003",
      name: "Michael Brown",
      grade: "11th",
      section: "A",
      sports: ["Cricket"],
      position: "Captain",
      achievements: ["Best Bowler", "Team Spirit Award"],
    },
    {
      id: "STU004",
      name: "Emily Davis",
      grade: "10th",
      section: "C",
      sports: ["Tennis", "Badminton"],
      position: "Player",
      achievements: ["District Champion", "Rising Star"],
    },
  ]

  const sportsStats = {
    totalTeams: sportsTeams.length,
    totalParticipants: studentParticipation.length,
    upcomingEvents: upcomingEvents.length,
    achievements: sportsTeams.reduce((total, team) => total + team.achievements.length, 0),
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-green-50/50 to-blue-100/50 dark:from-gray-900/50 dark:to-gray-800/50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 text-white shadow-2xl">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
            alt="Sports Complex"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-blue-900/50 to-purple-900/70" />
        </div>
        <div className="relative z-10 flex items-center gap-6 p-8 md:p-12">
          <SafeSidebarTrigger className="text-white hover:bg-white/20 rounded-lg p-2" />
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Sports Management
              </h1>
              <p className="text-green-100 text-lg md:text-xl max-w-2xl">
                Manage sports teams, events, and student participation - Building champions on and off the field
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span>{sportsStats.achievements} Total Achievements</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <Users className="h-4 w-4 text-blue-300" />
                <span>{sportsStats.totalParticipants} Active Athletes</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-right space-y-3">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Trophy className="h-12 w-12 text-yellow-300 mx-auto mb-2" />
                <div className="text-2xl font-bold">{sportsStats.totalTeams}</div>
                <div className="text-green-200 text-sm">Active Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Teams</CardTitle>
            <Users className="h-5 w-5 text-blue-200" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{sportsStats.totalTeams}</div>
            <p className="text-xs text-blue-200 mt-1">Across all sports</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Participants</CardTitle>
            <Target className="h-5 w-5 text-green-200" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{sportsStats.totalParticipants}</div>
            <p className="text-xs text-green-200 mt-1">Active athletes</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Upcoming Events</CardTitle>
            <Calendar className="h-5 w-5 text-purple-200" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{sportsStats.upcomingEvents}</div>
            <p className="text-xs text-purple-200 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-100">Achievements</CardTitle>
            <Trophy className="h-5 w-5 text-yellow-200" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{sportsStats.achievements}</div>
            <p className="text-xs text-yellow-200 mt-1">Total awards won</p>
          </CardContent>
        </Card>
      </div>

      {/* Sports Management Tabs */}
      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-1">
          <TabsTrigger value="teams" className="rounded-lg">
            Teams
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg">
            Events
          </TabsTrigger>
          <TabsTrigger value="participants" className="rounded-lg">
            Participants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500 text-white">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sports Teams</CardTitle>
                    <CardDescription>Manage school sports teams and their achievements</CardDescription>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Team</DialogTitle>
                      <DialogDescription>Create a new sports team</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" placeholder="Enter team name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sport">Sport</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="coach">Coach</Label>
                        <Input id="coach" placeholder="Enter coach name" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Team</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {sportsTeams.map((team) => (
                  <Card
                    key={team.id}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`relative h-56 bg-gradient-to-br ${team.bgColor || "from-blue-400 to-purple-500"} overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${team.bgColor || "from-blue-400 to-purple-500"} opacity-30`} />
                      <Image
                        src={team.image}
                        alt={team.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-lg">
                          {team.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white space-y-1">
                        <h3 className="text-2xl font-bold">{team.name}</h3>
                        <p className="text-sm text-gray-200">{team.sport}</p>
                        <p className="text-xs text-gray-300">{team.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Coach:</span>
                          <div className="font-medium">{team.coach}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Captain:</span>
                          <div className="font-medium">{team.captain}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Members:</span>
                          <div className="font-medium">{team.members} players</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Achievements:</span>
                          <div className="font-medium">{team.achievements.length} awards</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Recent Achievements:</p>
                        <div className="flex flex-wrap gap-2">
                          {team.achievements.slice(0, 2).map((achievement, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              <Medal className="h-3 w-3 mr-1" />
                              {achievement.length > 20 ? `${achievement.substring(0, 20)}...` : achievement}
                            </Badge>
                          ))}
                          {team.achievements.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{team.achievements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sports Events</CardTitle>
                    <CardDescription>Upcoming competitions and tournaments</CardDescription>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold">Event Name</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Venue</TableHead>
                      <TableHead className="font-semibold">Teams</TableHead>
                      <TableHead className="font-semibold">Priority</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {event.teams.join(", ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                            {event.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {event.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500 text-white">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Student Athletes</CardTitle>
                    <CardDescription>Students participating in sports activities</CardDescription>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold">Student Name</TableHead>
                      <TableHead className="font-semibold">Grade</TableHead>
                      <TableHead className="font-semibold">Sports</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">Achievements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentParticipation.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {student.grade} {student.section}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.sports.map((sport, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.position === "Captain" ? "default" : "secondary"} className="text-xs">
                            {student.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.achievements.slice(0, 2).map((achievement, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                            {student.achievements.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{student.achievements.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
