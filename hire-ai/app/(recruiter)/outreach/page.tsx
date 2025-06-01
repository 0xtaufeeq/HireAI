"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Send, Calendar, TrendingUp, MessageSquare, Plus, Edit, Copy } from "lucide-react"

const emailTemplates = [
  {
    id: 1,
    name: "Initial Outreach - AI Engineer",
    subject: "Exciting AI Engineering Opportunity at {company}",
    content: `Hi {firstName},

I came across your profile and was impressed by your experience with {skills}. We have an exciting opportunity for a {position} role at {company} that I think would be a great fit for your background.

Key highlights:
• Work on cutting-edge AI/ML projects
• Competitive salary: {salaryRange}
• Remote-friendly culture
• Equity package included

Would you be interested in a brief 15-minute call to discuss this opportunity?

Best regards,
{recruiterName}`,
    usage: 45,
    responseRate: 28,
  },
  {
    id: 2,
    name: "Follow-up - No Response",
    subject: "Following up on {position} opportunity",
    content: `Hi {firstName},

I wanted to follow up on my previous message about the {position} role at {company}. I understand you're likely busy, but I believe this opportunity could be a great next step in your career.

The role offers:
• {keyBenefit1}
• {keyBenefit2}
• {keyBenefit3}

If you're not interested, no worries at all. If you know someone who might be a good fit, I'd appreciate any referrals.

Thanks for your time!

{recruiterName}`,
    usage: 32,
    responseRate: 15,
  },
]

const campaigns = [
  {
    id: 1,
    name: "Senior ML Engineers - Q4 2024",
    status: "active",
    sent: 156,
    opened: 89,
    responded: 23,
    scheduled: 8,
    startDate: "2024-10-01",
    template: "Initial Outreach - AI Engineer",
  },
  {
    id: 2,
    name: "AI Research Scientists",
    status: "completed",
    sent: 78,
    opened: 45,
    responded: 12,
    scheduled: 4,
    startDate: "2024-09-15",
    template: "Initial Outreach - AI Engineer",
  },
]

const recentMessages = [
  {
    id: 1,
    candidate: "Sarah Chen",
    subject: "Re: Exciting AI Engineering Opportunity",
    preview: "Thanks for reaching out! I'd be interested in learning more about the role...",
    time: "2 hours ago",
    status: "replied",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    candidate: "Michael Rodriguez",
    subject: "AI Research Scientist Position",
    preview: "Hi! I'm currently happy in my role but would be open to discussing...",
    time: "1 day ago",
    status: "replied",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    candidate: "Emily Johnson",
    subject: "Following up on ML Engineer opportunity",
    preview: "",
    time: "3 days ago",
    status: "sent",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function OutreachPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0])
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outreach Management</h1>
        <p className="text-muted-foreground">Manage email campaigns, templates, and track candidate responses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 scheduled to start</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Email Campaigns</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={
                            campaign.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : ""
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Template: {campaign.template} • Started: {campaign.startDate}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex gap-4 text-sm">
                        <span>
                          Sent: <strong>{campaign.sent}</strong>
                        </span>
                        <span>
                          Opened: <strong>{campaign.opened}</strong>
                        </span>
                        <span>
                          Replied: <strong>{campaign.responded}</strong>
                        </span>
                        <span>
                          Scheduled: <strong>{campaign.scheduled}</strong>
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Response rate: {Math.round((campaign.responded / campaign.sent) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Email Templates</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              <div className="space-y-2">
                {emailTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate.id === template.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Used {template.usage} times</span>
                          <span>{template.responseRate}% response rate</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>{selectedTemplate.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{selectedTemplate.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Content</Label>
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap">
                    {selectedTemplate.content}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>Send personalized outreach to candidates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidates">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved-search">Saved Search: ML Engineers</SelectItem>
                      <SelectItem value="shortlist">Shortlist: Q4 Candidates</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Email subject line" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Compose your message..." className="min-h-[200px]" />
              </div>

              <div className="flex gap-2">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline">Schedule Send</Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest candidate responses and outreach activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.candidate} />
                      <AvatarFallback>
                        {message.candidate
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{message.candidate}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={message.status === "replied" ? "default" : "secondary"}
                            className={
                              message.status === "replied"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : ""
                            }
                          >
                            {message.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{message.subject}</p>
                      {message.preview && <p className="text-sm text-muted-foreground">{message.preview}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
