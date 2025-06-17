"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Save, HelpCircle } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";

interface EditTemplateDialogProps {
    template: EmailTemplate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateTemplate: (template: EmailTemplate) => void;
}

export function EditTemplateDialog({
    template,
    open,
    onOpenChange,
    onUpdateTemplate,
}: EditTemplateDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        content: "",
    });

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                subject: template.subject,
                content: template.content,
            });
        }
    }, [template]);

    const handleSubmit = () => {
        if (!template) return;

        const updatedTemplate: EmailTemplate = {
            ...template,
            name: formData.name,
            subject: formData.subject,
            content: formData.content,
            updatedAt: new Date().toISOString(),
        };

        onUpdateTemplate(updatedTemplate);
        onOpenChange(false);
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Template</DialogTitle>
                    <DialogDescription>
                        Make changes to your email template.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-template-name">
                            Template Name *
                        </Label>
                        <Input
                            id="edit-template-name"
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
                            <Label htmlFor="edit-template-subject">
                                Subject Line *
                            </Label>
                            <TooltipProvider>
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
                            </TooltipProvider>
                        </div>
                        <Input
                            id="edit-template-subject"
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
                            <Label htmlFor="edit-template-content">
                                Email Content *
                            </Label>
                            <TooltipProvider>
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
                            </TooltipProvider>
                        </div>
                        <Textarea
                            id="edit-template-content"
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
                                                "edit-template-content",
                                            ) as HTMLTextAreaElement;
                                        if (textarea) {
                                            const start =
                                                textarea.selectionStart;
                                            const end = textarea.selectionEnd;
                                            const newContent =
                                                formData.content.substring(
                                                    0,
                                                    start,
                                                ) +
                                                variable +
                                                formData.content.substring(end);
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
                            Click on a variable to insert it at cursor position
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!isFormValid}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
