"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Plus, FileText, HelpCircle } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";

interface NewTemplateDialogProps {
    onCreateTemplate: (
        template: Omit<
            EmailTemplate,
            "id" | "usage" | "responseRate" | "createdAt" | "updatedAt"
        >,
    ) => void;
}

export function NewTemplateDialog({
    onCreateTemplate,
}: NewTemplateDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        content: "",
    });

    const handleSubmit = () => {
        const template: Omit<
            EmailTemplate,
            "id" | "usage" | "responseRate" | "createdAt" | "updatedAt"
        > = {
            name: formData.name,
            subject: formData.subject,
            content: formData.content,
        };

        onCreateTemplate(template);
        setFormData({ name: "", subject: "", content: "" });
        setOpen(false);
    };

    const isFormValid = formData.name && formData.subject && formData.content;

    const templateVariables = [
        "{firstName}",
        "{lastName}",
        "{company}",
        "{position}",
        "{skills}",
        "{salaryRange}",
        "{recruiterName}",
        "{location}",
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <TooltipProvider>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Create New Template
                        </DialogTitle>
                        <DialogDescription>
                            Create a reusable email template for your outreach
                            campaigns.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="template-name">
                                Template Name *
                            </Label>
                            <Input
                                id="template-name"
                                placeholder="e.g., Follow-up - Technical Interview"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="template-subject">
                                    Subject Line *
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Use variables like {"{company}"} and{" "}
                                            {"{position}"} for personalization
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input
                                id="template-subject"
                                placeholder="e.g., Technical Interview Opportunity at {company}"
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
                            <div className="flex items-center gap-2">
                                <Label htmlFor="template-content">
                                    Email Content *
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            <p>Available variables:</p>
                                            <div className="text-xs">
                                                {templateVariables.map(
                                                    (variable) => (
                                                        <div key={variable}>
                                                            {variable}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Textarea
                                id="template-content"
                                placeholder={`Hi {firstName},

I hope this message finds you well. I came across your profile and was impressed by your experience with {skills}.

We have an exciting opportunity for a {position} role at {company} that I believe would be a great fit for your background.

Key highlights:
• Competitive salary: {salaryRange}
• Remote-friendly culture
• Cutting-edge projects

Would you be interested in a brief call to discuss this opportunity?

Best regards,
{recruiterName}`}
                                className="min-h-[250px] font-mono text-sm"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        content: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">
                                Available Variables:
                            </p>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                                {templateVariables.map((variable) => (
                                    <code
                                        key={variable}
                                        className="bg-background px-2 py-1 rounded cursor-pointer hover:bg-accent"
                                        onClick={() => {
                                            const textarea =
                                                document.getElementById(
                                                    "template-content",
                                                ) as HTMLTextAreaElement;
                                            if (textarea) {
                                                const start =
                                                    textarea.selectionStart;
                                                const end =
                                                    textarea.selectionEnd;
                                                const newContent =
                                                    formData.content.substring(
                                                        0,
                                                        start,
                                                    ) +
                                                    variable +
                                                    formData.content.substring(
                                                        end,
                                                    );
                                                setFormData({
                                                    ...formData,
                                                    content: newContent,
                                                });
                                                setTimeout(() => {
                                                    textarea.focus();
                                                    textarea.setSelectionRange(
                                                        start + variable.length,
                                                        start + variable.length,
                                                    );
                                                }, 0);
                                            }
                                        }}
                                    >
                                        {variable}
                                    </code>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Click on a variable to insert it at cursor
                                position
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!isFormValid}>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Template
                        </Button>
                    </DialogFooter>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    );
}
