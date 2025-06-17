"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    MapPin,
    Mail,
    Phone,
    Download,
    CheckCircle,
    MessageSquare,
    FileText,
    Award,
    Briefcase,
} from "lucide-react";

const candidateData = {
    id: 1,
    name: "Sarah Chen",
    title: "Senior ML Engineer",
    location: "San Francisco, CA",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    match: 95,
    availability: "Available",
    salary: "$180k - $220k",
    experience: "7 years",
    image: "/placeholder.svg?height=120&width=120",
    summary:
        "Experienced ML Engineer with expertise in deep learning, natural language processing, and MLOps. Led multiple AI initiatives at Fortune 500 companies, specializing in LangChain, RAG systems, and production ML pipelines.",
    skills: [
        { name: "Python", level: 95 },
        { name: "PyTorch", level: 90 },
        { name: "LangChain", level: 85 },
        { name: "RAG Systems", level: 88 },
        { name: "AWS", level: 80 },
        { name: "Docker", level: 75 },
        { name: "Kubernetes", level: 70 },
        { name: "MLOps", level: 85 },
    ],
    workHistory: [
        {
            company: "TechCorp Inc.",
            position: "Senior ML Engineer",
            duration: "2022 - Present",
            description:
                "Led development of RAG-based customer support system, improving response accuracy by 40%.",
        },
        {
            company: "AI Innovations",
            position: "ML Engineer",
            duration: "2020 - 2022",
            description:
                "Built and deployed multiple NLP models for content recommendation and sentiment analysis.",
        },
        {
            company: "DataTech Solutions",
            position: "Junior Data Scientist",
            duration: "2018 - 2020",
            description:
                "Developed predictive models for customer churn and implemented A/B testing frameworks.",
        },
    ],
    education: [
        {
            degree: "M.S. Computer Science",
            school: "Stanford University",
            year: "2018",
        },
        {
            degree: "B.S. Mathematics",
            school: "UC Berkeley",
            year: "2016",
        },
    ],
    certifications: [
        "AWS Certified Machine Learning - Specialty",
        "Google Cloud Professional ML Engineer",
        "Deep Learning Specialization (Coursera)",
    ],
    screening: {
        status: "Completed",
        score: 92,
        questions: [
            {
                question: "Explain your experience with RAG systems",
                answer: "I've implemented several RAG systems using LangChain and vector databases like Pinecone. Most recently, I built a customer support RAG system that reduced response time by 60% while maintaining 95% accuracy.",
                score: 95,
            },
            {
                question: "How do you handle model deployment and monitoring?",
                answer: "I use MLOps practices with Docker containers, Kubernetes for orchestration, and monitoring tools like MLflow for experiment tracking. I also implement A/B testing for model performance evaluation.",
                score: 88,
            },
        ],
    },
};

export default function CandidateProfile({
    params,
}: {
    params: { id: string };
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [notes, setNotes] = useState("");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage
                            src={candidateData.image || "/placeholder.svg"}
                            alt={candidateData.name}
                        />
                        <AvatarFallback className="text-lg">
                            {candidateData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {candidateData.name}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {candidateData.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {candidateData.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {candidateData.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {candidateData.phone}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                {candidateData.match}% match
                            </Badge>
                            <Badge variant="outline">
                                {candidateData.availability}
                            </Badge>
                            <Badge variant="secondary">
                                {candidateData.experience}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                    </Button>
                    <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">
                        Skills & Experience
                    </TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="screening">Screening</TabsTrigger>
                    <TabsTrigger value="outreach">Outreach</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed">
                                    {candidateData.summary}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm">Experience</span>
                                    <span className="text-sm font-medium">
                                        {candidateData.experience}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        Salary Range
                                    </span>
                                    <span className="text-sm font-medium">
                                        {candidateData.salary}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Match Score</span>
                                    <span className="text-sm font-medium">
                                        {candidateData.match}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        Availability
                                    </span>
                                    <span className="text-sm font-medium">
                                        {candidateData.availability}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {candidateData.education.map((edu, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
                                        <Award className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">
                                                {edu.degree}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {edu.school} • {edu.year}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {candidateData.certifications.map(
                                    (cert, index) => (
                                        <Badge key={index} variant="outline">
                                            {cert}
                                        </Badge>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Skills</CardTitle>
                            <CardDescription>
                                Skill proficiency levels based on resume
                                analysis and assessments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {candidateData.skills.map((skill, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                {skill.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {skill.level}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={skill.level}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {candidateData.workHistory.map((job, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    {job.position}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {job.company} •{" "}
                                                    {job.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm ml-6">
                                            {job.description}
                                        </p>
                                        {index <
                                            candidateData.workHistory.length -
                                                1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="resume" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resume Viewer</CardTitle>
                            <CardDescription>
                                Original resume with AI-parsed highlights
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg p-6 bg-muted/50 min-h-[600px] flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                                    <p className="text-muted-foreground">
                                        Resume viewer would be displayed here
                                    </p>
                                    <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="screening" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Screening Results</CardTitle>
                            <CardDescription>
                                Automated screening based on job requirements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        Overall Score
                                    </span>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                        {candidateData.screening.score}%
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">
                                        Screening{" "}
                                        {candidateData.screening.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Screening Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {candidateData.screening.questions.map(
                                    (qa, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm">
                                                    {qa.question}
                                                </p>
                                                <Badge variant="outline">
                                                    {qa.score}%
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                                                {qa.answer}
                                            </p>
                                            {index <
                                                candidateData.screening
                                                    .questions.length -
                                                    1 && <Separator />}
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="outreach" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Message</CardTitle>
                            <CardDescription>
                                Compose a personalized outreach message
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Hi Sarah, I came across your profile and was impressed by your experience with RAG systems..."
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button>Send Message</Button>
                                <Button variant="outline">
                                    Save as Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Message History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                                <p>No messages sent yet</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add your notes about this candidate..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <Button size="sm">Save Notes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
