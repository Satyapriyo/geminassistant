'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
    content: string;
    isUser: boolean;
}

export function MarkdownMessage({ content, isUser }: MarkdownMessageProps) {
    return (
        <div className={`prose ${isUser ? 'prose-invert' : 'prose-foreground'} max-w-none`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, className, children, ...props }: any) {
                        // Fallback logic to determine if it's inline code
                        const isInline = !(node?.position?.start?.line !== node?.position?.end?.line);
                        return (
                            <code
                                className={`${className ?? ''} ${isInline
                                    ? 'bg-muted px-1.5 py-0.5 rounded text-sm'
                                    : 'block bg-muted/50 p-4 rounded-lg my-2'
                                    }`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    a({ node, children, ...props }) {
                        return (
                            <a
                                className="text-primary hover:text-primary/80 underline"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    blockquote({ node, children, ...props }) {
                        return (
                            <blockquote
                                className="border-l-4 border-muted pl-4 italic text-muted-foreground"
                                {...props}
                            >
                                {children}
                            </blockquote>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
