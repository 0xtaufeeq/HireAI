"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    Mail,
    Target,
} from "lucide-react";

const hiringFunnelData = [
    { stage: "Sourced", count: 1250, percentage: 100 },
    { stage: "Contacted", count: 875, percentage: 70 },
    { stage: "Responded", count: 298, percentage: 24 },
    { stage: "Screened", count: 156, percentage: 12 },
    { stage: "Interviewed", count: 89, percentage: 7 },
    { stage: "Offered", count: 23, percentage: 2 },
    { stage: "Hired", count: 18, percentage: 1.4 },
];

const timeToHireData = [
    { month: "Jan", days: 45 },
    { month: "Feb", days: 42 },
    { month: "Mar", days: 38 },
    { month: "Apr", days: 35 },
    { month: "May", days: 32 },
    { month: "Jun", days: 29 },
];

const sourceEffectivenessData = [
    { source: "LinkedIn", candidates: 450, hired: 8, rate: 1.8 },
    { source: "GitHub", candidates: 320, hired: 6, rate: 1.9 },
    { source: "Referrals", candidates: 180, hired: 4, rate: 2.2 },
    { source: "Job Boards", candidates: 200, hired: 2, rate: 1.0 },
    { source: "Direct Outreach", candidates: 100, hired: 3, rate: 3.0 },
];

const diversityData = [
    { name: "Male", value: 65, color: "#3b82f6" },
    { name: "Female", value: 32, color: "#ef4444" },
    { name: "Non-binary", value: 3, color: "#10b981" },
];

const skillsDemandData = [
    { skill: "Python", demand: 95 },
    { skill: "Machine Learning", demand: 88 },
    { skill: "PyTorch", demand: 82 },
    { skill: "LangChain", demand: 75 },
    { skill: "RAG Systems", demand: 68 },
    { skill: "AWS", demand: 85 },
    { skill: "Docker", demand: 70 },
    { skill: "Kubernetes", demand: 65 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Analytics & Insights
                </h1>
                <p className="text-muted-foreground">
                    Track your hiring performance and gain insights into your
                    recruitment process.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Time to Hire
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">29 days</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingDown className="inline h-3 w-3 text-green-600" />
                            <span className="text-green-600">-13%</span> from
                            last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Response Rate
                        </CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">34%</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-600" />
                            <span className="text-green-600">+2%</span> from
                            last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversion Rate
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.4%</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-600" />
                            <span className="text-green-600">+0.2%</span> from
                            last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Candidates
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,847</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-600" />
                            <span className="text-green-600">+12%</span> from
                            last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="funnel" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                    <TabsTrigger value="diversity">Diversity</TabsTrigger>
                </TabsList>

                <TabsContent value="funnel" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiring Funnel</CardTitle>
                                <CardDescription>
                                    Candidate progression through hiring stages
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {hiringFunnelData.map((stage, index) => (
                                        <div
                                            key={stage.stage}
                                            className="space-y-2"
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">
                                                    {stage.stage}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {stage.count} (
                                                    {stage.percentage}%)
                                                </span>
                                            </div>
                                            <Progress
                                                value={stage.percentage}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Time to Hire Trend</CardTitle>
                                <CardDescription>
                                    Average days from first contact to hire
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={timeToHireData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="days"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: "#3b82f6" }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills in Demand</CardTitle>
                            <CardDescription>
                                Most requested skills in current job openings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {skillsDemandData.map((skill) => (
                                    <div
                                        key={skill.skill}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">
                                                {skill.skill}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {skill.demand}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={skill.demand}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Source Effectiveness</CardTitle>
                            <CardDescription>
                                Performance of different candidate sources
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sourceEffectivenessData.map((source) => (
                                    <div
                                        key={source.source}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {source.source}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {source.candidates} candidates •{" "}
                                                {source.hired} hired
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                source.rate >= 2
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                source.rate >= 2
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                    : ""
                                            }
                                        >
                                            {source.rate}% hire rate
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="diversity" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gender Diversity</CardTitle>
                                <CardDescription>
                                    Distribution of candidates by gender
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={diversityData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) =>
                                                `${name}: ${value}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {diversityData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bias Detection</CardTitle>
                                <CardDescription>
                                    AI-powered bias analysis in hiring decisions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Gender Bias Score
                                        </span>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Low Risk
                                        </Badge>
                                    </div>
                                    <Progress value={15} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Age Bias Score
                                        </span>
                                        <Badge variant="secondary">
                                            Medium Risk
                                        </Badge>
                                    </div>
                                    <Progress value={45} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Education Bias Score
                                        </span>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Low Risk
                                        </Badge>
                                    </div>
                                    <Progress value={20} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
