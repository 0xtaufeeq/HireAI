"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Components
import { OutreachStatsComponent } from "@/components/outreach/outreach-stats";
import { CampaignList } from "@/components/outreach/campaigns/campaign-list";
import { NewCampaignDialog } from "@/components/outreach/campaigns/new-campaign-dialog";
import { TemplateList } from "@/components/outreach/message-templates/template-list";
import { TemplatePreview } from "@/components/outreach/message-templates/template-preview";
import { NewTemplateDialog } from "@/components/outreach/message-templates/new-template-dialog";
import { EditTemplateDialog } from "@/components/outreach/message-templates/edit-template-dialog";
import { ComposeMessage } from "@/components/outreach/compose/compose-message";
import { MessageList } from "@/components/outreach/inbox/message-list";
import { MessageViewDialog } from "@/components/outreach/inbox/message-view-dialog";

// Types
import type {
    EmailTemplate,
    Campaign,
    Message,
    OutreachStats,
} from "@/types/outreach";

// Mock data
const initialStats: OutreachStats = {
    messagesSent: 234,
    responseRate: 28,
    interviewsScheduled: 12,
    activeCampaigns: 3,
    weeklyGrowth: {
        messagesSent: 12,
        responseRate: 3,
        interviewsScheduled: 2,
    },
};

const initialTemplates: EmailTemplate[] = [
    {
        id: 1,
        name: "Initial Outreach - AI Engineer",
        subject: "Exciting AI Engineering Opportunity at {company}",
        content: `Hi {firstName},

I came across your profile and was impressed by your experience with {skills}. We have an exciting opportunity for a {position} role at {company} that I think would be a great fit for your background.

Key highlights:
• Work on cutting-edge AI/ML projects
• Competitive salary: {salaryRange}
• Remote-friendly culture
• Equity package included

Would you be interested in a brief 15-minute call to discuss this opportunity?

Best regards,
{recruiterName}`,
        usage: 45,
        responseRate: 28,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
    },
    {
        id: 2,
        name: "Follow-up - No Response",
        subject: "Following up on {position} opportunity",
        content: `Hi {firstName},

I wanted to follow up on my previous message about the {position} role at {company}. I understand you're likely busy, but I believe this opportunity could be a great next step in your career.

The role offers:
• {keyBenefit1}
• {keyBenefit2}
• {keyBenefit3}

If you're not interested, no worries at all. If you know someone who might be a good fit, I'd appreciate any referrals.

Thanks for your time!

{recruiterName}`,
        usage: 32,
        responseRate: 15,
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-20T00:00:00Z",
    },
];

const initialCampaigns: Campaign[] = [
    {
        id: 1,
        name: "Senior ML Engineers - Q4 2024",
        status: "active",
        sent: 156,
        opened: 89,
        responded: 23,
        scheduled: 8,
        startDate: "2024-10-01",
        template: "Initial Outreach - AI Engineer",
        templateId: 1,
        targetAudience: "ml-engineers",
        description:
            "Targeting senior ML engineers with 5+ years experience for our AI platform team",
    },
    {
        id: 2,
        name: "AI Research Scientists",
        status: "completed",
        sent: 78,
        opened: 45,
        responded: 12,
        scheduled: 4,
        startDate: "2024-09-15",
        endDate: "2024-10-15",
        template: "Initial Outreach - AI Engineer",
        templateId: 1,
        targetAudience: "ai-researchers",
        description: "PhD-level researchers for our R&D division",
    },
];

const initialMessages: Message[] = [
    {
        id: 1,
        candidate: "Sarah Chen",
        candidateId: 1,
        subject: "Re: Exciting AI Engineering Opportunity",
        preview:
            "Thanks for reaching out! I'd be interested in learning more about the role...",
        time: "2 hours ago",
        status: "replied",
        avatar: "/placeholder.svg?height=32&width=32",
        fullContent:
            "Thanks for reaching out! I'd be interested in learning more about the role. The opportunity sounds exciting, especially the work on cutting-edge AI/ML projects. I'm currently employed but open to discussing new opportunities. Could we schedule a call for next week?",
        thread: [
            {
                id: 1,
                from: "You",
                content:
                    "Hi Sarah, I came across your profile and was impressed by your experience with PyTorch and LangChain. We have an exciting opportunity for a Senior ML Engineer role at TechCorp that I think would be a great fit for your background...",
                timestamp: "2 days ago",
                type: "sent",
                isRead: true,
            },
            {
                id: 2,
                from: "Sarah Chen",
                content:
                    "Thanks for reaching out! I'd be interested in learning more about the role. The opportunity sounds exciting, especially the work on cutting-edge AI/ML projects. I'm currently employed but open to discussing new opportunities. Could we schedule a call for next week?",
                timestamp: "2 hours ago",
                type: "received",
                isRead: false,
            },
        ],
    },
    {
        id: 2,
        candidate: "Michael Rodriguez",
        candidateId: 2,
        subject: "AI Research Scientist Position",
        preview:
            "Hi! I'm currently happy in my role but would be open to discussing...",
        time: "1 day ago",
        status: "replied",
        avatar: "/placeholder.svg?height=32&width=32",
        thread: [
            {
                id: 3,
                from: "You",
                content:
                    "Hi Michael, I noticed your impressive publication record in NLP and computer vision. We have a research scientist position that would allow you to continue publishing while working on applied research...",
                timestamp: "3 days ago",
                type: "sent",
                isRead: true,
            },
            {
                id: 4,
                from: "Michael Rodriguez",
                content:
                    "Hi! I'm currently happy in my role but would be open to discussing exceptional opportunities. The research focus you mentioned aligns well with my interests in NLP and computer vision. What's the research budget and publication policy?",
                timestamp: "1 day ago",
                type: "received",
                isRead: false,
            },
        ],
    },
];

export default function OutreachPage() {
    const { toast } = useToast();

    // State management
    const [stats] = useState<OutreachStats>(initialStats);
    const [templates, setTemplates] =
        useState<EmailTemplate[]>(initialTemplates);
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [messages] = useState<Message[]>(initialMessages);

    // UI state
    const [selectedTemplate, setSelectedTemplate] =
        useState<EmailTemplate | null>(templates[0]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(
        null,
    );
    const [editTemplateOpen, setEditTemplateOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] =
        useState<EmailTemplate | null>(null);
    const [messageViewOpen, setMessageViewOpen] = useState(false);

    // Campaign handlers
    const handleCreateCampaign = (
        campaignData: Omit<
            Campaign,
            "id" | "sent" | "opened" | "responded" | "scheduled"
        >,
    ) => {
        const newCampaign: Campaign = {
            ...campaignData,
            id: campaigns.length + 1,
            sent: 0,
            opened: 0,
            responded: 0,
            scheduled: 0,
        };
        setCampaigns([...campaigns, newCampaign]);
        toast({
            title: "Campaign Created",
            description: `Campaign "${newCampaign.name}" has been created successfully.`,
        });
    };

    const handleEditCampaign = (campaign: Campaign) => {
        // Implementation for editing campaign
        console.log("Edit campaign:", campaign);
        toast({
            title: "Edit Campaign",
            description:
                "Campaign editing functionality would be implemented here.",
        });
    };

    const handleDeleteCampaign = (campaignId: number) => {
        setCampaigns(campaigns.filter((c) => c.id !== campaignId));
        toast({
            title: "Campaign Deleted",
            description: "Campaign has been deleted successfully.",
            variant: "destructive",
        });
    };

    const handleToggleCampaign = (campaignId: number) => {
        setCampaigns(
            campaigns.map((c) =>
                c.id === campaignId
                    ? {
                          ...c,
                          status: c.status === "active" ? "draft" : "active",
                      }
                    : c,
            ),
        );
        toast({
            title: "Campaign Updated",
            description: "Campaign status has been updated.",
        });
    };

    // Template handlers
    const handleCreateTemplate = (
        templateData: Omit<
            EmailTemplate,
            "id" | "usage" | "responseRate" | "createdAt" | "updatedAt"
        >,
    ) => {
        const newTemplate: EmailTemplate = {
            ...templateData,
            id: templates.length + 1,
            usage: 0,
            responseRate: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setTemplates([...templates, newTemplate]);
        toast({
            title: "Template Created",
            description: `Template "${newTemplate.name}" has been created successfully.`,
        });
    };

    const handleEditTemplate = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setEditTemplateOpen(true);
    };

    const handleUpdateTemplate = (updatedTemplate: EmailTemplate) => {
        setTemplates(
            templates.map((t) =>
                t.id === updatedTemplate.id ? updatedTemplate : t,
            ),
        );
        if (selectedTemplate?.id === updatedTemplate.id) {
            setSelectedTemplate(updatedTemplate);
        }
        toast({
            title: "Template Updated",
            description: `Template "${updatedTemplate.name}" has been updated successfully.`,
        });
    };

    const handleDuplicateTemplate = (template: EmailTemplate) => {
        const duplicatedTemplate: EmailTemplate = {
            ...template,
            id: templates.length + 1,
            name: `${template.name} (Copy)`,
            usage: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setTemplates([...templates, duplicatedTemplate]);
        toast({
            title: "Template Duplicated",
            description: `Template "${duplicatedTemplate.name}" has been created.`,
        });
    };

    const handleDeleteTemplate = (templateId: number) => {
        setTemplates(templates.filter((t) => t.id !== templateId));
        if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(
                templates.find((t) => t.id !== templateId) || null,
            );
        }
        toast({
            title: "Template Deleted",
            description: "Template has been deleted successfully.",
            variant: "destructive",
        });
    };

    // Message handlers
    const handleViewMessage = (message: Message) => {
        setSelectedMessage(message);
        setMessageViewOpen(true);
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Outreach Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage email campaigns, templates, and track candidate
                        responses.
                    </p>
                </div>

                {/* Stats */}
                <OutreachStatsComponent stats={stats} />

                <Tabs defaultValue="campaigns" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="compose">Compose</TabsTrigger>
                        <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    </TabsList>

                    <TabsContent value="campaigns" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                Email Campaigns
                            </h3>
                            <NewCampaignDialog
                                templates={templates}
                                onCreateCampaign={handleCreateCampaign}
                            />
                        </div>
                        <CampaignList
                            campaigns={campaigns}
                            onEditCampaign={handleEditCampaign}
                            onDeleteCampaign={handleDeleteCampaign}
                            onToggleCampaign={handleToggleCampaign}
                        />
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">
                                        Email Templates
                                    </h3>
                                    <NewTemplateDialog
                                        onCreateTemplate={handleCreateTemplate}
                                    />
                                </div>
                                <TemplateList
                                    templates={templates}
                                    selectedTemplate={selectedTemplate}
                                    onSelectTemplate={setSelectedTemplate}
                                />
                            </div>
                            <TemplatePreview
                                template={selectedTemplate}
                                onEditTemplate={handleEditTemplate}
                                onDuplicateTemplate={handleDuplicateTemplate}
                                onDeleteTemplate={handleDeleteTemplate}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="compose" className="space-y-4">
                        <ComposeMessage templates={templates} />
                    </TabsContent>

                    <TabsContent value="inbox" className="space-y-4">
                        <MessageList
                            messages={messages}
                            onMessageClick={handleViewMessage}
                        />
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <EditTemplateDialog
                    template={editingTemplate}
                    open={editTemplateOpen}
                    onOpenChange={setEditTemplateOpen}
                    onUpdateTemplate={handleUpdateTemplate}
                />

                <MessageViewDialog
                    message={selectedMessage}
                    open={messageViewOpen}
                    onOpenChange={setMessageViewOpen}
                />
            </div>
        </TooltipProvider>
    );
}
