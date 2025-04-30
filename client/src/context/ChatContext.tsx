import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initOpenAIService, getOpenAIService } from '@/services/openai';
import { env } from '@/config/env';

// Define types
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isInitialized: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Context provider
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  // Try to initialize API on load, always using the key from environment variables
  useEffect(() => {
    initializeAPI();
  }, []);

  // Initialize API with key
  const initializeAPI = () => {
    try {
      const apiKey = env.OPENAI_API_KEY;

      if (!apiKey) {
        console.warn('OpenAI API key not found in environment variables');
        setIsInitialized(false);
        setError('OpenAI API key not found. Check your .env file');
        return;
      }
      
      initOpenAIService(apiKey);
      
      // Add system message for context
      const systemMessage: Message = {
        id: 'system-0',
        content: env.SYSTEM_PROMPT,
        isUser: false,
        timestamp: new Date(),
        role: 'system'
      };
      
      // Add welcome message from the assistant
      const welcomeMessage: Message = {
        id: 'welcome-0',
        content: "Welcome to DeFather! I'm your AI assistant for developing DeFi applications on Rootstock. Here's how I can help you:\n\n" +
                "• To start the interactive guide, ask me about **creating a DeFi application on Rootstock**\n" + 
                "• Learn about **smart contracts**, **environment setup**, or **frontend integration**\n" +
                "• Ask questions about **deploying contracts** or browse **additional resources**\n\n" +
                "What would you like to learn about today?",
        isUser: false,
        timestamp: new Date(),
        role: 'assistant'
      };
      
      setMessages(prev => {
        // Check if there's already a system message
        const hasSystemMessage = prev.some(msg => msg.role === 'system');
        const hasWelcomeMessage = prev.some(msg => msg.id === 'welcome-0');
        
        if (!hasSystemMessage && !hasWelcomeMessage) {
          return [systemMessage, welcomeMessage];
        }
        
        if (!hasWelcomeMessage) {
          return [...prev, welcomeMessage];
        }
        
        return prev;
      });
      
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setIsInitialized(false);
      setError('Failed to initialize OpenAI API');
      console.error('Failed to initialize OpenAI API:', err);
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!isInitialized) {
      setError('API not initialized. Make sure VITE_OPENAI_API_KEY is set in .env');
      return;
    }

    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
        role: 'user'
      };

      // Update state with new user message
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Prepare message history for API request
      const messageHistory = messages
        .filter(msg => msg.role !== 'system' || msg.id === 'system-0')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Add new user message
      messageHistory.push({
        role: 'user' as const,
        content
      });

      // Send request to OpenAI
      const openaiService = getOpenAIService();
      const response = await openaiService.chatCompletion(messageHistory);

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response || 'I could not generate a response. Please try again.',
        isUser: false,
        timestamp: new Date(),
        role: 'assistant'
      };

      // Update state with assistant response
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Error processing AI request');
      console.error('Error sending message to OpenAI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message history (except system message)
  const clearMessages = () => {
    setMessages(prev => {
      // Keep system message but remove welcome message
      const systemMessages = prev.filter(msg => msg.role === 'system');
      
      // Add welcome message again
      const welcomeMessage: Message = {
        id: 'welcome-0',
        content: "Welcome to DeFather! I'm your AI assistant for developing DeFi applications on Rootstock. Here's how I can help you:\n\n" +
                "• To start the interactive guide, ask me about **creating a DeFi application on Rootstock**\n" + 
                "• Learn about **smart contracts**, **environment setup**, or **frontend integration**\n" +
                "• Ask questions about **deploying contracts** or browse **additional resources**\n\n" +
                "What would you like to learn about today?",
        isUser: false,
        timestamp: new Date(),
        role: 'assistant'
      };
      
      return [...systemMessages, welcomeMessage];
    });
  };

  // Provide values through context
  const value = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isInitialized,
    inputValue,
    setInputValue
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook for using the context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
