"use client";

import type React from "react";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Upload,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Download,
} from "lucide-react";

const mockParsingResults = [
    {
        id: 1,
        fileName: "sarah_chen_resume.pdf",
        status: "completed",
        uploadTime: "2 minutes ago",
        extractedData: {
            name: "Sarah Chen",
            email: "sarah.chen@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            title: "Senior ML Engineer",
            experience: "7 years",
            skills: ["Python", "PyTorch", "LangChain", "RAG", "AWS", "Docker"],
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
            workHistory: [
                {
                    company: "TechCorp Inc.",
                    position: "Senior ML Engineer",
                    duration: "2022 - Present",
                    description:
                        "Led development of RAG-based customer support system",
                },
            ],
        },
    },
    {
        id: 2,
        fileName: "michael_rodriguez_resume.pdf",
        status: "processing",
        uploadTime: "5 minutes ago",
        progress: 75,
    },
    {
        id: 3,
        fileName: "emily_johnson_resume.pdf",
        status: "failed",
        uploadTime: "10 minutes ago",
        error: "Unable to extract text from PDF",
    },
];

export default function ResumeParserPage() {
    const [dragActive, setDragActive] = useState(false);
    const [selectedResult, setSelectedResult] = useState(mockParsingResults[0]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        // Handle file drop logic here
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Resume Parser
                </h1>
                <p className="text-muted-foreground">
                    Upload resumes to automatically extract candidate
                    information using AI.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upload Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Resumes</CardTitle>
                            <CardDescription>
                                Drag and drop PDF or Word documents, or click to
                                browse
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    dragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-lg font-medium mb-2">
                                    Drop resumes here
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Supports PDF, DOC, DOCX files up to 10MB
                                </p>
                                <Button>Browse Files</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Processing Queue */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Processing Queue</CardTitle>
                            <CardDescription>
                                Recent uploads and their processing status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockParsingResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                            selectedResult.id === result.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/50"
                                        }`}
                                        onClick={() =>
                                            setSelectedResult(result)
                                        }
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {result.fileName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {result.uploadTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {result.status ===
                                                    "completed" && (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                )}
                                                {result.status ===
                                                    "processing" && (
                                                    <Badge variant="secondary">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Processing
                                                    </Badge>
                                                )}
                                                {result.status === "failed" && (
                                                    <Badge variant="destructive">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        Failed
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {result.status === "processing" &&
                                            result.progress && (
                                                <Progress
                                                    value={result.progress}
                                                    className="mt-2"
                                                />
                                            )}
                                        {result.status === "failed" &&
                                            result.error && (
                                                <p className="text-xs text-destructive mt-2">
                                                    {result.error}
                                                </p>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {selectedResult.status === "completed" &&
                        selectedResult.extractedData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Parsing Results</CardTitle>
                                    <CardDescription>
                                        Extracted information from{" "}
                                        {selectedResult.fileName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs
                                        defaultValue="overview"
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="overview">
                                                Overview
                                            </TabsTrigger>
                                            <TabsTrigger value="skills">
                                                Skills
                                            </TabsTrigger>
                                            <TabsTrigger value="experience">
                                                Experience
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value="overview"
                                            className="space-y-4"
                                        >
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Name
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .name
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Email
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Phone
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .phone
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Location
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .location
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Title
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .title
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Experience
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedResult
                                                                .extractedData
                                                                .experience
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value="skills"
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Extracted Skills
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedResult.extractedData.skills.map(
                                                        (skill, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value="experience"
                                            className="space-y-4"
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Education
                                                    </label>
                                                    <div className="space-y-2">
                                                        {selectedResult.extractedData.education.map(
                                                            (edu, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="text-sm"
                                                                >
                                                                    <p className="font-medium">
                                                                        {
                                                                            edu.degree
                                                                        }
                                                                    </p>
                                                                    <p className="text-muted-foreground">
                                                                        {
                                                                            edu.school
                                                                        }{" "}
                                                                        •{" "}
                                                                        {
                                                                            edu.year
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">
                                                        Work History
                                                    </label>
                                                    <div className="space-y-3">
                                                        {selectedResult.extractedData.workHistory.map(
                                                            (job, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="text-sm"
                                                                >
                                                                    <p className="font-medium">
                                                                        {
                                                                            job.position
                                                                        }
                                                                    </p>
                                                                    <p className="text-muted-foreground">
                                                                        {
                                                                            job.company
                                                                        }{" "}
                                                                        •{" "}
                                                                        {
                                                                            job.duration
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {
                                                                            job.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="flex gap-2 pt-4">
                                        <Button>Add to Candidate Pool</Button>
                                        <Button variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Data
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {selectedResult.status === "processing" && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                                <p className="text-lg font-medium mb-2">
                                    Processing Resume
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    AI is extracting information from{" "}
                                    {selectedResult.fileName}
                                </p>
                                <Progress
                                    value={selectedResult.progress || 0}
                                    className="w-full"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {selectedResult.status === "failed" && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                                <p className="text-lg font-medium mb-2">
                                    Processing Failed
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {selectedResult.error}
                                </p>
                                <Button variant="outline">Try Again</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
