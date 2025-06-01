"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Filter, Star, Users, Tag, MoreHorizontal, Eye, Mail, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

const talentPools = [
  {
    id: 1,
    name: "Senior ML Engineers",
    description: "Experienced machine learning engineers with 5+ years",
    count: 156,
    tags: ["Machine Learning", "Python", "PyTorch"],
    lastUpdated: "2 days ago",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  {
    id: 2,
    name: "AI Research Scientists",
    description: "PhD-level researchers in AI and machine learning",
    count: 89,
    tags: ["Research", "PhD", "Publications"],
    lastUpdated: "1 week ago",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  },
  {
    id: 3,
    name: "GenAI Specialists",
    description: "Experts in generative AI and large language models",
    count: 234,
    tags: ["LLMs", "LangChain", "RAG", "OpenAI"],
    lastUpdated: "3 days ago",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  {
    id: 4,
    name: "Remote-First Candidates",
    description: "Candidates specifically interested in remote work",
    count: 312,
    tags: ["Remote", "Distributed", "Async"],
    lastUpdated: "1 day ago",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  },
]

const pipelineStages = [
  { name: "Sourced", count: 1250, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
  { name: "Contacted", count: 875, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
  { name: "Responded", count: 298, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
  { name: "Screened", count: 156, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
  { name: "Interviewed", count: 89, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
  { name: "Offered", count: 23, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
]

const candidatesInPool = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior ML Engineer",
    location: "San Francisco, CA",
    stage: "Screened",
    tags: ["Python", "PyTorch", "LangChain"],
    addedDate: "2024-01-15",
    lastContact: "2024-01-20",
    notes: "Strong technical background, interested in RAG systems",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "AI Research Scientist",
    location: "New York, NY",
    stage: "Contacted",
    tags: ["Research", "NLP", "Publications"],
    addedDate: "2024-01-10",
    lastContact: "2024-01-18",
    notes: "PhD from MIT, 15+ publications in top-tier conferences",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Emily Johnson",
    title: "GenAI Engineer",
    location: "Austin, TX",
    stage: "Interviewed",
    tags: ["LLMs", "OpenAI", "Vector DBs"],
    addedDate: "2024-01-05",
    lastContact: "2024-01-22",
    notes: "Excellent interview performance, considering offer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TalentPoolPage() {
  const [selectedPool, setSelectedPool] = useState(talentPools[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])

  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talent Pool Management</h1>
        <p className="text-muted-foreground">Organize and manage your candidate pipeline with custom talent pools.</p>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Talent Pools</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="tags">Tags & Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pools List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Talent Pools</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Pool
                </Button>
              </div>

              <div className="space-y-2">
                {talentPools.map((pool) => (
                  <Card
                    key={pool.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPool.id === pool.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setSelectedPool(pool)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{pool.name}</h4>
                          <Badge className={pool.color}>{pool.count}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{pool.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {pool.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Updated {pool.lastUpdated}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pool Details */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedPool.name}</CardTitle>
                      <CardDescription>{selectedPool.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Pool</DropdownMenuItem>
                        <DropdownMenuItem>Export Candidates</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate Pool</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Pool</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search candidates in this pool..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedCandidates.length > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">{selectedCandidates.length} selected</span>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Tag className="h-4 w-4 mr-2" />
                          Add Tags
                        </Button>
                        <Button size="sm" variant="outline">
                          Move to Pool
                        </Button>
                      </div>
                    )}

                    {/* Candidates List */}
                    <div className="space-y-3">
                      {candidatesInPool.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={selectedCandidates.includes(candidate.id)}
                            onCheckedChange={() => handleSelectCandidate(candidate.id)}
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                            <AvatarFallback>
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{candidate.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{candidate.stage}</Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/candidates/${candidate.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Profile
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Move to Pool
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {candidate.title} • {candidate.location}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>Added: {candidate.addedDate}</span>
                              <span>Last contact: {candidate.lastContact}</span>
                            </div>
                            {candidate.notes && (
                              <p className="text-xs text-muted-foreground italic">"{candidate.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Track candidates through different stages of your hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {pipelineStages.map((stage) => (
                  <Card key={stage.name} className="text-center">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{stage.name}</h4>
                        <div className="text-2xl font-bold">{stage.count}</div>
                        <Badge className={stage.color}>{stage.name}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Actions</CardTitle>
              <CardDescription>Manage candidate progression through your hiring stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Bulk Move Candidates
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Mail className="h-6 w-6 mb-2" />
                  Send Stage Updates
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Star className="h-6 w-6 mb-2" />
                  Mark as Priority
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Tag className="h-6 w-6 mb-2" />
                  Apply Tags
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags & Categories</CardTitle>
              <CardDescription>Organize candidates with custom tags and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Skills Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python",
                      "PyTorch",
                      "TensorFlow",
                      "LangChain",
                      "RAG",
                      "NLP",
                      "Computer Vision",
                      "MLOps",
                      "AWS",
                      "Docker",
                      "Kubernetes",
                    ].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Experience Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Junior", "Mid-level", "Senior", "Lead", "Principal", "Staff"].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Location Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Remote",
                      "Hybrid",
                      "On-site",
                      "US Only",
                      "Global",
                      "EU Timezone",
                      "West Coast",
                      "East Coast",
                    ].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Custom Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {["High Priority", "Referral", "Previous Applicant", "Passive Candidate", "Open to Relocation"].map(
                      (tag) => (
                        <Badge
                          key={tag}
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tag
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
