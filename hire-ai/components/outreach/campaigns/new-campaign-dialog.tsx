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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Calendar, Users, Mail } from "lucide-react";
import type { EmailTemplate, Campaign } from "@/types/outreach";

interface NewCampaignDialogProps {
    templates: EmailTemplate[];
    onCreateCampaign: (
        campaign: Omit<
            Campaign,
            "id" | "sent" | "opened" | "responded" | "scheduled"
        >,
    ) => void;
}

export function NewCampaignDialog({
    templates,
    onCreateCampaign,
}: NewCampaignDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        templateId: "",
        targetAudience: "",
        startDate: "",
        endDate: "",
    });

    const handleSubmit = () => {
        const selectedTemplate = templates.find(
            (t) => t.id.toString() === formData.templateId,
        );
        if (!selectedTemplate) return;

        const campaign: Omit<
            Campaign,
            "id" | "sent" | "opened" | "responded" | "scheduled"
        > = {
            name: formData.name,
            description: formData.description,
            status:
                formData.startDate === new Date().toISOString().split("T")[0]
                    ? "active"
                    : "scheduled",
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            template: selectedTemplate.name,
            templateId: selectedTemplate.id,
            targetAudience: formData.targetAudience,
        };

        onCreateCampaign(campaign);
        setFormData({
            name: "",
            description: "",
            templateId: "",
            targetAudience: "",
            startDate: "",
            endDate: "",
        });
        setOpen(false);
    };

    const isFormValid =
        formData.name &&
        formData.templateId &&
        formData.targetAudience &&
        formData.startDate;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <TooltipProvider>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Create New Campaign
                        </DialogTitle>
                        <DialogDescription>
                            Set up a new outreach campaign to engage with
                            candidates.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="campaign-name">
                                Campaign Name *
                            </Label>
                            <Input
                                id="campaign-name"
                                placeholder="e.g., Senior ML Engineers - Q1 2025"
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
                            <Label htmlFor="campaign-description">
                                Description
                            </Label>
                            <Textarea
                                id="campaign-description"
                                placeholder="Brief description of the campaign goals and target audience"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="campaign-template">
                                Email Template *
                            </Label>
                            <Select
                                value={formData.templateId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        templateId: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem
                                            key={template.id}
                                            value={template.id.toString()}
                                        >
                                            <div className="flex flex-col">
                                                <span>{template.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {template.responseRate}%
                                                    response rate • Used{" "}
                                                    {template.usage} times
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="target-audience">
                                Target Audience *
                            </Label>
                            <Select
                                value={formData.targetAudience}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        targetAudience: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select target audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ml-engineers">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            ML Engineers (156 candidates)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="ai-researchers">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            AI Researchers (89 candidates)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="data-scientists">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Data Scientists (234 candidates)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="genai-specialists">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            GenAI Specialists (67 candidates)
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="custom">
                                        Custom Selection
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Start Date *</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            startDate: e.target.value,
                                        })
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date">
                                    End Date (Optional)
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            endDate: e.target.value,
                                        })
                                    }
                                    min={formData.startDate}
                                />
                            </div>
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
                            <Calendar className="h-4 w-4 mr-2" />
                            Create Campaign
                        </Button>
                    </DialogFooter>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    );
}
