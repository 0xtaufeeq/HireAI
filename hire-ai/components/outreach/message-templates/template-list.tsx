"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Clock, TrendingUp } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";

interface TemplateListProps {
    templates: EmailTemplate[];
    selectedTemplate: EmailTemplate | null;
    onSelectTemplate: (template: EmailTemplate) => void;
}

export function TemplateList({
    templates,
    selectedTemplate,
    onSelectTemplate,
}: TemplateListProps) {
    return (
        <TooltipProvider>
            <div className="space-y-2">
                {templates.map((template) => (
                    <Card
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                            selectedTemplate?.id === template.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => onSelectTemplate(template)}
                    >
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">
                                        {template.name}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {template.responseRate}%
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {template.subject}
                                </p>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    <Tooltip>
                                        <TooltipTrigger className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            <span>
                                                Used {template.usage} times
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Number of times this template
                                                has been used in campaigns
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                Updated{" "}
                                                {new Date(
                                                    template.updatedAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Last time this template was
                                                modified
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TooltipProvider>
    );
}
