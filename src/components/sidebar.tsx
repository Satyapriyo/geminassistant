'use client';
import { SheetTitle } from './ui/sheet';
import { useChatStore } from '@/store/chatStore';
import {
    Plus,
    Trash2,
    MessageSquare,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from './ui/tooltip';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from './ui/alert-dialog';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { SidebarContent } from "./sidebarContent";
export function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);

    const {
        conversations,
        currentConversationId,
        createNewConversation,
        switchConversation,
        deleteConversation,
        setInput,
    } = useChatStore();

    const handleNewChat = () => {
        createNewConversation();
        setInput('');
    };

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-2 left-2 z-50">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MessageSquare />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetTitle className="sr-only">Chat Sidebar</SheetTitle> {/* Hidden but accessible */}
                        <SidebarContent
                            collapsed={false}
                            handleNewChat={handleNewChat}
                            conversations={conversations}
                            currentConversationId={currentConversationId}
                            switchConversation={switchConversation}
                            deleteConversation={deleteConversation}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Collapsible Sidebar */}
            <div
                className={cn(
                    'hidden md:flex flex-col h-screen transition-all duration-300 bg-gradient-to-b from-white to-violet-100 dark:from-black dark:to-violet-900 text-black dark:text-white border-r border-gray-200 dark:border-gray-700',
                    collapsed ? 'w-[60px]' : 'w-64'
                )}
            >
                <div className="flex items-center justify-between p-2">
                    {!collapsed && <h2 className="text-lg font-semibold px-2">Chats</h2>}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </Button>
                </div>

                <div className="p-2">
                    <Button
                        onClick={handleNewChat}
                        variant="secondary"
                        className="w-full justify-start h-10"
                    >
                        <Plus strokeWidth={2.5} className={cn('w-5 h-5', !collapsed && 'mr-2')} />
                        {!collapsed && 'New Chat'}
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-1 pb-4">
                    <div className="space-y-1">
                        {conversations.map((conversation) => (
                            <TooltipProvider key={conversation.id}>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <div
                                            onClick={() => switchConversation(conversation.id)}
                                            className={cn(
                                                'group flex items-center justify-between rounded-md cursor-pointer px-2 py-1.5 transition-colors text-sm',
                                                conversation.id === currentConversationId
                                                    ? 'bg-violet-800 text-white'
                                                    : 'hover:bg-violet-700 text-gray-200'
                                            )}
                                        >
                                            <div className="flex-1 min-w-0 truncate">
                                                {collapsed ? (
                                                    <MessageSquare className="w-5 h-5" />
                                                ) : (
                                                    <>
                                                        <p className="truncate">{conversation.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {format(conversation.createdAt, 'MMM d, h:mm a')}
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            {!collapsed && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Conversation
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this
                                                                conversation?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteConversation(conversation.id);
                                                                }}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    {collapsed && (
                                        <TooltipContent side="right">
                                            {conversation.title}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-2 mt-auto">
                    <ThemeToggle />
                </div>
            </div>
        </>
    );
}
