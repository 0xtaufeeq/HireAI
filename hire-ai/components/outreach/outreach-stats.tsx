import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Mail, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import type { OutreachStats } from "@/types/outreach";

interface OutreachStatsProps {
    stats: OutreachStats;
}

export function OutreachStatsComponent({ stats }: OutreachStatsProps) {
    return (
        <TooltipProvider>
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Messages Sent
                        </CardTitle>
                        <Tooltip>
                            <TooltipTrigger>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Total number of outreach messages sent
                                    across all campaigns
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.messagesSent.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span
                                className={
                                    stats.weeklyGrowth.messagesSent >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {stats.weeklyGrowth.messagesSent >= 0
                                    ? "+"
                                    : ""}
                                {stats.weeklyGrowth.messagesSent}%
                            </span>{" "}
                            from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Response Rate
                        </CardTitle>
                        <Tooltip>
                            <TooltipTrigger>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Percentage of candidates who replied to your
                                    outreach messages
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.responseRate}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span
                                className={
                                    stats.weeklyGrowth.responseRate >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {stats.weeklyGrowth.responseRate >= 0
                                    ? "+"
                                    : ""}
                                {stats.weeklyGrowth.responseRate}%
                            </span>{" "}
                            from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Interviews Scheduled
                        </CardTitle>
                        <Tooltip>
                            <TooltipTrigger>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Number of interviews scheduled from outreach
                                    campaigns
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.interviewsScheduled}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span
                                className={
                                    stats.weeklyGrowth.interviewsScheduled >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {stats.weeklyGrowth.interviewsScheduled >= 0
                                    ? "+"
                                    : ""}
                                {stats.weeklyGrowth.interviewsScheduled}
                            </span>{" "}
                            from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Campaigns
                        </CardTitle>
                        <Tooltip>
                            <TooltipTrigger>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Currently running outreach campaigns</p>
                            </TooltipContent>
                        </Tooltip>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.activeCampaigns}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            2 scheduled to start
                        </p>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
