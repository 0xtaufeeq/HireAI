export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
    usage: number;
    responseRate: number;
    createdAt: string;
    updatedAt: string;
}

export interface Campaign {
    id: number;
    name: string;
    status: "active" | "completed" | "draft" | "scheduled";
    sent: number;
    opened: number;
    responded: number;
    scheduled: number;
    startDate: string;
    endDate?: string;
    template: string;
    templateId: number;
    targetAudience: string;
    description?: string;
}

export interface Message {
    id: number;
    candidate: string;
    candidateId: number;
    subject: string;
    preview: string;
    time: string;
    status: "replied" | "sent" | "opened" | "bounced";
    avatar: string;
    fullContent?: string;
    campaignId?: number;
    thread?: MessageThread[];
}

export interface MessageThread {
    id: number;
    from: string;
    content: string;
    timestamp: string;
    type: "sent" | "received";
    isRead: boolean;
}

export interface OutreachStats {
    messagesSent: number;
    responseRate: number;
    interviewsScheduled: number;
    activeCampaigns: number;
    weeklyGrowth: {
        messagesSent: number;
        responseRate: number;
        interviewsScheduled: number;
    };
}
