"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Mic, Filter, MapPin, Clock, Star, ExternalLink } from "lucide-react"
import Link from "next/link"

const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior ML Engineer",
    location: "San Francisco, CA",
    match: 95,
    skills: ["PyTorch", "LangChain", "RAG", "Python", "AWS"],
    availability: "Available",
    salary: "$180k - $220k",
    experience: "7 years",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "AI Research Scientist",
    location: "New York, NY",
    match: 92,
    skills: ["TensorFlow", "NLP", "Computer Vision", "Research", "PhD"],
    availability: "2 weeks notice",
    salary: "$200k - $250k",
    experience: "9 years",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Emily Johnson",
    title: "GenAI Engineer",
    location: "Austin, TX",
    match: 89,
    skills: ["OpenAI API", "Vector DBs", "LLMs", "React", "Node.js"],
    availability: "Available",
    salary: "$160k - $190k",
    experience: "5 years",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David Kim",
    title: "Machine Learning Engineer",
    location: "Seattle, WA",
    match: 87,
    skills: ["Scikit-learn", "MLOps", "Docker", "Kubernetes", "GCP"],
    availability: "1 month notice",
    salary: "$170k - $200k",
    experience: "6 years",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "AI Product Manager",
    location: "Los Angeles, CA",
    match: 84,
    skills: ["Product Strategy", "AI/ML", "Agile", "Roadmapping", "Analytics"],
    availability: "Available",
    salary: "$150k - $180k",
    experience: "8 years",
    image: "/placeholder.svg?height=40&width=40",
  },
]

const recentSearches = [
  "Senior Gen-AI engineers with LangChain + RAG experience in Europe",
  "ML Engineers with PyTorch experience, remote work",
  "AI Research Scientists with PhD, computer vision",
  "Data Scientists with NLP experience, San Francisco",
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [salaryRange, setSalaryRange] = useState([100, 300])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Candidates</h1>
        <p className="text-muted-foreground">Use natural language to find the perfect AI talent for your team.</p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Find senior Gen-AI engineers with LangChain + RAG experience in Europe, open to contract work"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-12 text-lg"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button size="sm" variant="ghost">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Recent searches:</Label>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        {showFilters && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Experience Level</Label>
                <div className="space-y-2">
                  {["Junior (1-3 years)", "Mid (3-6 years)", "Senior (6+ years)", "Lead (8+ years)"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox id={level} />
                      <Label htmlFor={level} className="text-sm">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Salary Range (k$)</Label>
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  max={300}
                  min={50}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${salaryRange[0]}k</span>
                  <span>${salaryRange[1]}k</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Availability</Label>
                <div className="space-y-2">
                  {["Available now", "2 weeks notice", "1 month notice", "Open to opportunities"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox id={status} />
                      <Label htmlFor={status} className="text-sm">
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="space-y-2">
                  {["Python", "PyTorch", "TensorFlow", "LangChain", "RAG", "NLP", "Computer Vision", "MLOps"].map(
                    (skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox id={skill} />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className={`space-y-4 ${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Found {mockCandidates.length} candidates</p>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort by:</Label>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.title}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {candidate.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {candidate.availability}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {candidate.match}% match
                    </Badge>
                    <p className="text-sm font-medium">{candidate.salary}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/candidates/${candidate.id}`}>
                          View Profile
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button size="sm">2</Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
