"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { HelpCircle, Play, Pause, Edit, Trash2 } from "lucide-react";
import type { Campaign } from "@/types/outreach";

interface CampaignListProps {
    campaigns: Campaign[];
    onEditCampaign: (campaign: Campaign) => void;
    onDeleteCampaign: (campaignId: number) => void;
    onToggleCampaign: (campaignId: number) => void;
}

export function CampaignList({
    campaigns,
    onEditCampaign,
    onDeleteCampaign,
    onToggleCampaign,
}: CampaignListProps) {
    const getStatusColor = (status: Campaign["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
            case "completed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
            case "scheduled":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
        }
    };

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">
                                            {campaign.name}
                                        </h4>
                                        <Badge
                                            className={getStatusColor(
                                                campaign.status,
                                            )}
                                        >
                                            {campaign.status}
                                        </Badge>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Campaign performance metrics
                                                    and status
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Template: {campaign.template} • Started:{" "}
                                        {campaign.startDate}
                                    </p>
                                    {campaign.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {campaign.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right space-y-1">
                                        <div className="flex gap-4 text-sm">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        Sent:{" "}
                                                        <strong>
                                                            {campaign.sent}
                                                        </strong>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Total messages sent in
                                                        this campaign
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        Opened:{" "}
                                                        <strong>
                                                            {campaign.opened}
                                                        </strong>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Messages that were
                                                        opened by candidates
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        Replied:{" "}
                                                        <strong>
                                                            {campaign.responded}
                                                        </strong>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Candidates who responded
                                                        to your message
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        Scheduled:{" "}
                                                        <strong>
                                                            {campaign.scheduled}
                                                        </strong>
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Interviews scheduled
                                                        from this campaign
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Response rate:{" "}
                                            {campaign.sent > 0
                                                ? Math.round(
                                                      (campaign.responded /
                                                          campaign.sent) *
                                                          100,
                                                  )
                                                : 0}
                                            %
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        onToggleCampaign(
                                                            campaign.id,
                                                        )
                                                    }
                                                    disabled={
                                                        campaign.status ===
                                                        "completed"
                                                    }
                                                >
                                                    {campaign.status ===
                                                    "active" ? (
                                                        <Pause className="h-4 w-4" />
                                                    ) : (
                                                        <Play className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {campaign.status ===
                                                    "active"
                                                        ? "Pause campaign"
                                                        : "Start campaign"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        onEditCampaign(campaign)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Edit campaign settings</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        onDeleteCampaign(
                                                            campaign.id,
                                                        )
                                                    }
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete campaign</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TooltipProvider>
    );
}
