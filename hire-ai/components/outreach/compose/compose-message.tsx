"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Send, Clock, Save, Users, Mail, Eye } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";
import { sendMail, type sendMailProps } from "@/utils/mailgun/sendMail";
import { htmlTemplates } from "@/app/(recruiter)/outreach/_templates";

interface ComposeMessageProps {
    templates?: EmailTemplate[];
}

export function ComposeMessage({
    templates = htmlTemplates,
}: ComposeMessageProps) {
    const [selectedTemplate, setSelectedTemplate] =
        useState<string>("no-template");
    const [emailData, setEmailData] = useState<sendMailProps>({
        to: [],
        subject: "",
        text: "",
    });
    const [selectedRecipientGroup, setSelectedRecipientGroup] =
        useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState<"text" | "html">("text");

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find((t) => t.id.toString() === templateId);
        if (template) {
            setEmailData((prev) => ({
                ...prev,
                subject: template.subject,
                text: template.content,
            }));
        }
    };

    const getRecipientEmails = (recipients: string): string[] => {
        // put supabase DB query here later
        const recipientMap: Record<string, string[]> = {
            "saved-search": [process.env.NEXT_PUBLIC_TEST_EMAIL!],
            shortlist: [process.env.NEXT_PUBLIC_TEST_EMAIL!],
            "talent-pool": [process.env.NEXT_PUBLIC_TEST_EMAIL!],
            custom: [process.env.NEXT_PUBLIC_TEST_EMAIL!],
        };
        return recipientMap[recipients]?.filter((email) => email) || [];
    };

    const handleRecipientChange = (value: string) => {
        setSelectedRecipientGroup(value);
        const recipientEmails = getRecipientEmails(value);
        setEmailData((prev) => ({
            ...prev,
            to: recipientEmails,
        }));
    };

    const processTemplateVariables = (content: string): string => {
        // Mock data for template variables - replace with actual candidate data
        const mockData = {
            firstName: "John",
            lastName: "Doe",
            company: "TechCorp Inc.",
            position: "Senior AI Engineer",
            skills: "Machine Learning, Python, TensorFlow",
            salaryRange: "$120k - $160k",
            recruiterName: "Sarah Johnson",
            location: "San Francisco, CA",
            industry: "Technology",
            currentCompany: "Current Tech Co",
            teamSize: "15",
            recruiterTitle: "Senior Technical Recruiter",
            recruiterEmail: "sarah@company.com",
            interviewDate: "March 15th, 2024",
            interviewTime: "2:00 PM PST",
            duration: "60",
            interviewFormat: "Video call (Google Meet)",
            interviewers: "John Smith (CTO), Jane Doe (Lead Engineer)",
            meetingLink: "https://meet.google.com/abc-defg-hij",
            techTopics: "System Design, Machine Learning",
            relevantTech: "Python, TensorFlow, AWS",
            strongPoints: "system architecture and ML implementation",
            specificFeedback:
                "Your approach to scalable ML systems was particularly impressive",
            futureRole1: "Staff Engineer positions",
            futureRole2: "ML Engineering Lead roles",
            futureRole3: "AI Research positions",
            linkedinProfile: "https://linkedin.com/in/recruiter",
            keyBenefit1: "Equity in a fast-growing startup",
            keyBenefit2: "Flexible remote work policy",
            keyBenefit3: "Professional development budget of $5k/year",
        };

        let processedContent = content;
        Object.entries(mockData).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, "g");
            processedContent = processedContent.replace(regex, value);
        });

        return processedContent;
    };

    const handleSendNow = async () => {
        if (!emailData.to.length || !emailData.subject || !emailData.text) {
            return;
        }

        setIsLoading(true);
        try {
            // Process template variables before sending
            const processedSubject = processTemplateVariables(
                emailData.subject,
            );
            const processedContent = processTemplateVariables(emailData.text);

            await sendMail({
                to: emailData.to,
                subject: processedSubject,
                text: processedContent,
            });

            console.log("Message sent successfully to:", emailData.to);

            // Reset form after successful send
            setEmailData({
                to: [],
                subject: "",
                text: "",
            });
            setSelectedRecipientGroup("");
            setSelectedTemplate("no-template");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleSend = () => {
        // Implementation for scheduling message
        console.log("Scheduling message:", emailData);
    };

    const handleSaveDraft = () => {
        // Implementation for saving draft
        console.log("Saving draft:", emailData);
    };

    const isFormValid =
        emailData.to.length > 0 && emailData.subject && emailData.text;

    // Check if current content is HTML
    const isHtmlContent =
        emailData.text.includes("<html>") ||
        emailData.text.includes("<!DOCTYPE");

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Compose Message
                    </CardTitle>
                    <CardDescription>
                        Send personalized outreach to candidates using HTML
                        templates
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="template">Template</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Select
                                        value={selectedTemplate}
                                        onValueChange={handleTemplateChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no-template">
                                                No template
                                            </SelectItem>
                                            {templates.map((template) => (
                                                <SelectItem
                                                    key={template.id}
                                                    value={template.id.toString()}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {template.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                template.responseRate
                                                            }
                                                            % response rate
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Choose a pre-built HTML template to
                                        start with
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="candidates">Recipients</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Select
                                        value={selectedRecipientGroup}
                                        onValueChange={handleRecipientChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select candidates" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="saved-search">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Saved Search: ML Engineers
                                                    (45 candidates)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="shortlist">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Shortlist: Q4 Candidates (23
                                                    candidates)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="talent-pool">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Talent Pool: GenAI
                                                    Specialists (67 candidates)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="custom">
                                                Custom Selection
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Select which candidates will receive
                                        this message
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Show selected recipients count */}
                    {emailData.to.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Selected {emailData.to.length} recipient
                            {emailData.to.length !== 1 ? "s" : ""}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="Email subject line"
                            value={emailData.subject}
                            onChange={(e) =>
                                setEmailData((prev) => ({
                                    ...prev,
                                    subject: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="message">Message</Label>
                            {isHtmlContent && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setPreviewMode(
                                                previewMode === "text"
                                                    ? "html"
                                                    : "text",
                                            )
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        {previewMode === "text"
                                            ? "Preview HTML"
                                            : "Edit Source"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {previewMode === "html" && isHtmlContent ? (
                            <div className="border rounded-lg min-h-[400px] p-4 bg-white">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: processTemplateVariables(
                                            emailData.text,
                                        ),
                                    }}
                                    className="prose max-w-none"
                                />
                            </div>
                        ) : (
                            <Textarea
                                id="message"
                                placeholder="Compose your message..."
                                className="min-h-[400px] font-mono text-sm"
                                value={emailData.text}
                                onChange={(e) =>
                                    setEmailData((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                    }))
                                }
                            />
                        )}
                    </div>

                    {isHtmlContent && (
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                            <strong>Template Variables Available:</strong>{" "}
                            {"{firstName}"}, {"{lastName}"}, {"{company}"},{" "}
                            {"{position}"}, {"{skills}"}, {"{salaryRange}"},{" "}
                            {"{recruiterName}"}, and more. Variables will be
                            automatically replaced when sending.
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSendNow}
                                    disabled={!isFormValid || isLoading}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {isLoading ? "Sending..." : "Send Now"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Send the HTML message immediately to
                                    selected candidates
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={handleScheduleSend}
                                    disabled={!isFormValid || isLoading}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Schedule Send
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Schedule the message to be sent at a
                                    specific time
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isLoading}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
