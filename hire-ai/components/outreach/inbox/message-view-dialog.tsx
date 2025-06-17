import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Users, Reply } from "lucide-react";
import type { Message } from "@/types/outreach";

interface MessageViewDialogProps {
    message: Message | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MessageViewDialog({
    message,
    open,
    onOpenChange,
}: MessageViewDialogProps) {
    if (!message) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
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
                        {message.candidate}
                    </DialogTitle>
                    <DialogDescription>{message.subject}</DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[500px] pr-4">
                    <div className="space-y-4">
                        {message.thread?.map((threadMessage, index) => (
                            <div
                                key={threadMessage.id}
                                className={`space-y-2 ${
                                    threadMessage.type === "sent"
                                        ? "ml-8"
                                        : "mr-8"
                                }`}
                            >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">
                                        {threadMessage.type === "sent"
                                            ? "You"
                                            : message.candidate}
                                    </span>
                                    <span>•</span>
                                    <span>{threadMessage.timestamp}</span>
                                    {!threadMessage.isRead &&
                                        threadMessage.type === "received" && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                New
                                            </span>
                                        )}
                                </div>
                                <div
                                    className={`p-3 rounded-lg ${
                                        threadMessage.type === "sent"
                                            ? "bg-primary/10 border-l-2 border-primary"
                                            : "bg-muted border-l-2 border-muted-foreground"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">
                                        {threadMessage.content}
                                    </p>
                                </div>
                                {index < (message.thread?.length || 0) - 1 && (
                                    <Separator className="my-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                    </Button>
                    <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                    </Button>
                    <Button>
                        <Users className="h-4 w-4 mr-2" />
                        Add to Pipeline
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
