'use client';
import { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { TypingAnimation } from './typing-animation';
import { Send, Trash2, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { MarkdownMessage } from './markdown-message';
import { LoadingAnimation } from './loading-animation';

export default function Chat() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [initialQuery, setInitialQuery] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [pendingInitialMessage, setPendingInitialMessage] = useState<string | null>(null);
    const {
        conversations,
        currentConversationId,
        input,
        isLoading,
        setInput,
        sendMessage,
        clearChat,
        createNewConversation
    } = useChatStore();

    const currentConversation = conversations.find(conv => conv.id === currentConversationId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentConversation?.messages]);

    useEffect(() => {
        // Reset isNewMessage when switching conversations
        setIsNewMessage(false);
    }, [currentConversationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            await sendMessage(input);
            setInput("");
        }
    };

    const handleEmptyStateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            // Only create a new conversation if there are no conversations
            if (conversations.length === 0) {

                setIsTransitioning(true);
                createNewConversation();
                setPendingInitialMessage(input);
                setInput("");
            } else {
                // If a conversation exists, just send the message
                await sendMessage(input);
                setInput("");
            }
        }
    };

    useEffect(() => {
        if (pendingInitialMessage && currentConversationId && conversations.length === 1) {
            // Only send the message after the new conversation is set, and only for the first conversation
            sendMessage(pendingInitialMessage);
            setPendingInitialMessage(null);
        }
    }, [pendingInitialMessage, currentConversationId, conversations.length, sendMessage]);

    const handleCopy = async (content: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (!currentConversationId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] gap-4">
                <div className="p-8 text-center max-w-md md:max-w-3xl w-full border-none">
                    <h2 className="text-2xl md:text-6xl font-semibold mb-2">What can I help with?</h2>
                    <p className="text-muted-foreground md:text-2xl mb-6">Start a new conversation by typing your message below</p>
                    <form onSubmit={handleEmptyStateSubmit} className="flex gap-2 max-w-md mx-auto">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            size="icon"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] max-w-full md:max-w-4xl mx-auto p-2 md:p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <h2 className="text-xl font-semibold text-foreground">{currentConversation?.title}</h2>
                </div>
                <Button
                    onClick={clearChat}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Chat
                </Button>
            </div>

            <ScrollArea className="flex-1 rounded-lg border bg-card w-full max-w-full">
                <div ref={scrollRef} className="space-y-4 p-4">
                    <AnimatePresence mode="popLayout">
                        {isTransitioning && initialQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="flex justify-end"
                            >
                                <div className="max-w-[80%] rounded-lg p-4 bg-primary text-primary-foreground">
                                    <MarkdownMessage content={initialQuery} isUser={true} />
                                </div>
                            </motion.div>
                        )}
                        {currentConversation?.messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    <MarkdownMessage content={message.content} isUser={message.role === 'user'} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-muted rounded-lg p-4">
                                <LoadingAnimation />
                            </div>
                        </motion.div>
                    )}
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2 mt-2 md:mt-4 w-full">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 w-full"
                />
                <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="w-10 h-10"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
} 