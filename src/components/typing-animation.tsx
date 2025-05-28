'use client';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Components } from 'react-markdown';

interface TypingAnimationProps {
    content: string;
    isUser: boolean;
    onComplete?: () => void;
    skipAnimation?: boolean;
}

export function TypingAnimation({ content, isUser, onComplete, skipAnimation = false }: TypingAnimationProps) {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (isUser || skipAnimation) {
            setDisplayedContent(content);
            setIsTyping(false);
            onComplete?.();
            return;
        }

        let currentIndex = 0;
        const words = content.split(/(\s+)/);

        const interval = setInterval(() => {
            if (currentIndex < words.length) {
                setDisplayedContent(prev => prev + words[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                onComplete?.();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [content, isUser, onComplete, skipAnimation]);

    const components: Components = {
        code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return (
                <code
                    className={`${className} ${isInline
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
    };

    return (
        <div className={`prose ${isUser ? 'prose-invert' : 'prose-foreground'} max-w-none text-left`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {displayedContent}
            </ReactMarkdown>
            {isTyping && !skipAnimation && (
                <span className="inline-block w-2 h-4 ml-1 bg-muted-foreground animate-pulse" />
            )}
        </div>
    );
}