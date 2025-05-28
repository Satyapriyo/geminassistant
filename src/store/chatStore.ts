import { create } from 'zustand';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
}

interface ChatState {
    conversations: Conversation[];
    currentConversationId: string | null;
    isLoading: boolean;
    input: string;
    // Actions
    setInput: (input: string) => void;
    addMessage: (message: Message) => void;
    setLoading: (isLoading: boolean) => void;
    clearChat: () => void;
    sendMessage: (content: string) => Promise<void>;
    createNewConversation: () => void;
    switchConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    currentConversationId: null,
    isLoading: false,
    input: '',

    setInput: (input: string) => set({ input }),
    
    addMessage: (message: Message) => 
        set((state) => {
            const conversations = state.conversations.map(conv => {
                if (conv.id === state.currentConversationId) {
                    return {
                        ...conv,
                        messages: [...conv.messages, message],
                        title: conv.messages.length === 0 ? message.content.slice(0, 30) + '...' : conv.title
                    };
                }
                return conv;
            });
            return { conversations };
        }),
    
    setLoading: (isLoading: boolean) => set({ isLoading }),
    
    clearChat: () => set((state) => ({
        conversations: state.conversations.map(conv => 
            conv.id === state.currentConversationId 
                ? { ...conv, messages: [] }
                : conv
        )
    })),

    createNewConversation: () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
        };
        set(state => ({
            conversations: [newConversation, ...state.conversations],
            currentConversationId: newConversation.id,
            input: ''
        }));
    },

    switchConversation: (id: string) => {
        set({ currentConversationId: id, input: '' });
    },

    deleteConversation: (id: string) => {
        set(state => {
            const conversations = state.conversations.filter(conv => conv.id !== id);
            return {
                conversations,
                currentConversationId: conversations[0]?.id || null
            };
        });
    },

    sendMessage: async (content: string) => {
        const { conversations, currentConversationId, addMessage, setLoading } = get();
        const currentConversation = conversations.find(conv => conv.id === currentConversationId);
        
        if (!currentConversation) return;

        // Add user message
        const userMessage: Message = { role: 'user', content };
        addMessage(userMessage);
        set({ input: '' });
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...currentConversation.messages, userMessage] }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.text();
            addMessage({ role: 'assistant', content: data });
        } catch (error) {
            console.error('Error:', error);
            addMessage({
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    },
})); 