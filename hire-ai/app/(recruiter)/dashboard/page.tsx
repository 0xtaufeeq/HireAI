import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    FileText,
    Mail,
    TrendingUp,
    Clock,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        title: "Total Candidates",
        value: "2,847",
        change: "+12%",
        icon: Users,
        color: "text-muted-foreground",
    },
    {
        title: "Active Searches",
        value: "23",
        change: "+5%",
        icon: FileText,
        color: "text-muted-foreground",
    },
    {
        title: "Outreach Sent",
        value: "156",
        change: "+8%",
        icon: Mail,
        color: "text-muted-foreground",
    },
    {
        title: "Response Rate",
        value: "34%",
        change: "+2%",
        icon: TrendingUp,
        color: "text-muted-foreground",
    },
];

const recentActivity = [
    {
        action: "New candidate added",
        candidate: "Sarah Chen",
        time: "2 minutes ago",
        type: "success",
    },
    {
        action: "Resume parsed",
        candidate: "Michael Rodriguez",
        time: "15 minutes ago",
        type: "info",
    },
    {
        action: "Interview scheduled",
        candidate: "Emily Johnson",
        time: "1 hour ago",
        type: "warning",
    },
    {
        action: "Offer sent",
        candidate: "David Kim",
        time: "3 hours ago",
        type: "success",
    },
];

const topCandidates = [
    {
        name: "Alex Thompson",
        title: "Senior ML Engineer",
        match: 95,
        skills: ["PyTorch", "LangChain", "RAG"],
        location: "San Francisco, CA",
    },
    {
        name: "Maria Garcia",
        title: "AI Research Scientist",
        match: 92,
        skills: ["TensorFlow", "NLP", "Computer Vision"],
        location: "New York, NY",
    },
    {
        name: "James Wilson",
        title: "GenAI Engineer",
        match: 89,
        skills: ["OpenAI API", "Vector DBs", "LLMs"],
        location: "Austin, TX",
    },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div
                className="space-y-2"
                style={{
                    animation: `elegant-fade-in 500ms var(--ease-out-cubic)`,
                }}
            >
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground/80">
                    Welcome back! Here's what's happening with your hiring
                    pipeline.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="card-elegant group border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-400"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
                            opacity: 0,
                        }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary/70 transition-colors duration-300" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="text-2xl font-semibold tracking-tight group-hover:text-primary/90 transition-colors duration-300">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground/60">
                                <span className="text-primary font-medium">
                                    {stat.change}
                                </span>{" "}
                                from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card
                    className="col-span-2 card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
                    style={{
                        animationDelay: "400ms",
                        animation: `elegant-slide-in 600ms var(--ease-out-cubic) forwards`,
                        opacity: 0,
                    }}
                >
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            Recent Activity
                            <div className="h-1.5 w-1.5 bg-primary/60 rounded-full notification-pulse"></div>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/70">
                            Latest updates from your hiring pipeline
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 p-3 rounded-md hover:bg-muted/30 transition-all duration-300 group cursor-pointer border border-transparent hover:border-border/30"
                                    style={{
                                        animationDelay: `${(index + 5) * 80}ms`,
                                        animation: `elegant-fade-in 500ms var(--ease-out-cubic) forwards`,
                                        opacity: 0,
                                    }}
                                >
                                    <div className="flex-shrink-0">
                                        {activity.type === "success" && (
                                            <CheckCircle className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-200" />
                                        )}
                                        {activity.type === "info" && (
                                            <FileText className="h-4 w-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-200" />
                                        )}
                                        {activity.type === "warning" && (
                                            <Clock className="h-4 w-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-muted-foreground/60">
                                            {activity.candidate}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-sm text-muted-foreground/50">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Candidates */}
                <Card
                    className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
                    style={{
                        animationDelay: "500ms",
                        animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
                        opacity: 0,
                    }}
                >
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Top Matches</CardTitle>
                        <CardDescription className="text-muted-foreground/70">
                            Highest scoring candidates this week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCandidates.map((candidate, index) => (
                                <div
                                    key={index}
                                    className="space-y-3 p-3 rounded-md hover:bg-muted/20 transition-all duration-300 group cursor-pointer border border-transparent hover:border-border/20"
                                    style={{
                                        animationDelay: `${(index + 9) * 100}ms`,
                                        animation: `elegant-fade-in 600ms var(--ease-out-cubic) forwards`,
                                        opacity: 0,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                                                {candidate.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60">
                                                {candidate.title}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="badge-elegant text-primary bg-primary/10 border-primary/20 hover:bg-primary/15"
                                        >
                                            {candidate.match}%
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {candidate.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="badge-elegant text-xs text-muted-foreground/70 border-border/60 hover:border-primary/30 hover:text-muted-foreground"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground/50">
                                        {candidate.location}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card
                className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm"
                style={{
                    animationDelay: "600ms",
                    animation: `elegant-fade-in 700ms var(--ease-out-cubic) forwards`,
                    opacity: 0,
                }}
            >
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription className="text-muted-foreground/70">
                        Common tasks to get you started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button
                            asChild
                            className="button-elegant h-20 flex-col bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <Link href="/search" className="group">
                                <Users className="h-6 w-6 mb-2 icon-elegant" />
                                <span className="font-medium">
                                    Search Candidates
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="button-elegant h-20 flex-col border-border/60 hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Link href="/resume-parser" className="group">
                                <FileText className="h-6 w-6 mb-2 icon-elegant" />
                                <span className="font-medium">
                                    Parse Resume
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="button-elegant h-20 flex-col border-border/60 hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Link href="/outreach" className="group">
                                <Mail className="h-6 w-6 mb-2 icon-elegant" />
                                <span className="font-medium">
                                    Send Outreach
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="button-elegant h-20 flex-col border-border/60 hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Link href="/analytics" className="group">
                                <TrendingUp className="h-6 w-6 mb-2 icon-elegant" />
                                <span className="font-medium">
                                    View Analytics
                                </span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
