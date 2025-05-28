
'use client';

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
export function SidebarContent({
    collapsed,
    handleNewChat,
    conversations,
    currentConversationId,
    switchConversation,
    deleteConversation,
  }: {
    collapsed: boolean;
    handleNewChat: () => void;
    conversations: any[];
    currentConversationId: string | null;
    switchConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
  }) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-2">
          <Button
            onClick={handleNewChat}
            variant="secondary"
            className="w-full justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
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
                                Are you sure you want to delete this conversation?
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
      </div>
    );
  }
  