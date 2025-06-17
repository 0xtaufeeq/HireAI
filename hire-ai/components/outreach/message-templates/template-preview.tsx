"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Edit, Copy, Trash2 } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";

interface TemplatePreviewProps {
    template: EmailTemplate | null;
    onEditTemplate: (template: EmailTemplate) => void;
    onDuplicateTemplate: (template: EmailTemplate) => void;
    onDeleteTemplate: (templateId: number) => void;
}

export function TemplatePreview({
    template,
    onEditTemplate,
    onDuplicateTemplate,
    onDeleteTemplate,
}: TemplatePreviewProps) {
    if (!template) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                        Select a template to preview
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <TooltipProvider>
                <CardHeader>
                    <CardTitle>Template Preview</CardTitle>
                    <CardDescription>{template.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Subject</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
                            {template.subject}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Content</Label>
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap max-h-[300px] overflow-y-auto mt-1">
                            {template.content}
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                            <p>
                                Created:{" "}
                                {new Date(
                                    template.createdAt,
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                Last updated:{" "}
                                {new Date(
                                    template.updatedAt,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={() => onEditTemplate(template)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit this email template</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onDuplicateTemplate(template)
                                        }
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Clone
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Create a copy of this template</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onDeleteTemplate(template.id)
                                        }
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete this template</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </TooltipProvider>
        </Card>
    );
}
