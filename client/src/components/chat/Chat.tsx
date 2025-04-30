import { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { useGuide } from "@/context/GuideContext";
import { useNavigate } from "react-router-dom";

export default function Chat(): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isLoading, error, isInitialized, inputValue, setInputValue } = useChat();
  const { processChatMessage } = useGuide();
  const navigate = useNavigate();

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  // Message send handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // User message
    const userMessage = inputValue;
    
    // Send message through context
    await sendMessage(inputValue);
    setInputValue("");

    // Check if the user is requesting to create a DeFi application or dapp
    const lowercaseMessage = userMessage.toLowerCase();
    const isDeFiRequest = (
      (lowercaseMessage.includes("defi") || lowercaseMessage.includes("dapp") || lowercaseMessage.includes("app")) && 
      (lowercaseMessage.includes("create") || 
       lowercaseMessage.includes("develop") || 
       lowercaseMessage.includes("build") ||
       lowercaseMessage.includes("help") ||
       lowercaseMessage.includes("guide") ||
       lowercaseMessage.includes("start") ||
       lowercaseMessage.includes("how to") ||
       lowercaseMessage.includes("learn")) &&
      lowercaseMessage.includes("rootstock")
    );
    
    console.log("Message triggers interactive guide:", isDeFiRequest, lowercaseMessage);

    // Check if user message contains trigger phrases for the guide
    const guideResponse = processChatMessage(userMessage);

    // If it's a DeFi application request, redirect to the interactive guide
    if (isDeFiRequest) {
      console.log("Redirecting to interactive guide...");
      setTimeout(() => {
        sendMessage("I've prepared an interactive guide for creating DeFi applications on Rootstock. I'll redirect you to the guide page now.");
        
        // Small delay before redirecting
        setTimeout(() => {
          console.log("Executing navigation to /guide");
          navigate("/guide");
        }, 1500);
      }, 1000);
    }
    // If the message triggers a change in the guide
    else if (guideResponse) {
      setTimeout(() => {
        sendMessage(guideResponse);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">Chat with AI assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500">
            {error}
          </div>
        )}
        
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              Start a conversation with AI assistant
            </p>
          </div>
        ) : (
          messages
            .filter(message => message.role !== 'system')
            .map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-gray-900 text-white rounded-l-lg px-4 py-2 focus:outline-none"
            disabled={isLoading || !isInitialized}
          />
          <button
            type="submit"
            className={`${
              isLoading || !isInitialized
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded-r-lg transition-colors`}
            disabled={isLoading || !isInitialized}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
