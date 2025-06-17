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
import { Send, Clock, Save, Users, Mail } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";

interface ComposeMessageProps {
    templates: EmailTemplate[];
}

export function ComposeMessage({ templates }: ComposeMessageProps) {
    const [selectedTemplate, setSelectedTemplate] =
        useState<string>("no-template");
    const [formData, setFormData] = useState({
        recipients: "",
        subject: "",
        content: "",
    });

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find((t) => t.id.toString() === templateId);
        if (template) {
            setFormData({
                ...formData,
                subject: template.subject,
                content: template.content,
            });
        }
    };

    const handleSendNow = () => {
        // Implementation for sending message immediately
        console.log("Sending message now:", formData);
    };

    const handleScheduleSend = () => {
        // Implementation for scheduling message
        console.log("Scheduling message:", formData);
    };

    const handleSaveDraft = () => {
        // Implementation for saving draft
        console.log("Saving draft:", formData);
    };

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Compose Message
                    </CardTitle>
                    <CardDescription>
                        Send personalized outreach to candidates
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
                                        Choose a pre-built template to start
                                        with
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="candidates">Recipients</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Select
                                        value={formData.recipients}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                recipients: value,
                                            })
                                        }
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

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="Email subject line"
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subject: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Compose your message..."
                            className="min-h-[200px]"
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSendNow}
                                    disabled={
                                        !formData.recipients ||
                                        !formData.subject ||
                                        !formData.content
                                    }
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Now
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Send the message immediately to selected
                                    candidates
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={handleScheduleSend}
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
                        <Button variant="outline" onClick={handleSaveDraft}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}
