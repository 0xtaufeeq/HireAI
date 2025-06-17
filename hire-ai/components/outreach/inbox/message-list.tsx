"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "@/types/outreach";

interface MessageListProps {
    messages: Message[];
    onMessageClick: (message: Message) => void;
}

export function MessageList({ messages, onMessageClick }: MessageListProps) {
    const getStatusColor = (status: Message["status"]) => {
        switch (status) {
            case "replied":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
            case "opened":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
            case "sent":
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
            case "bounced":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                    Latest candidate responses and outreach activity
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => onMessageClick(message)}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={message.avatar || "/placeholder.svg"}
                                    alt={message.candidate}
                                />
                                <AvatarFallback>
                                    {message.candidate
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        {message.candidate}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={getStatusColor(
                                                message.status,
                                            )}
                                        >
                                            {message.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {message.time}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {message.subject}
                                </p>
                                {message.preview && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {message.preview}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
