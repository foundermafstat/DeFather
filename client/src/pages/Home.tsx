import InfiniteScroll from "@/components/home/InfiniteScroll";
import Starters from "@/components/home/Starters";
import { useChat } from "@/context/ChatContext";

export function Home() {
  const { setInputValue } = useChat();
  
  // Function to add command to chat input
  const addCommandToChat = (command: string) => {
    setInputValue(command);
    // Focus the chat input
    setTimeout(() => {
      const chatInput = document.querySelector('input[type="text"][placeholder="Write a message..."]') as HTMLInputElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 100);
  };

  // Chat commands
  const chatCommands = [
    { id: 'create-defi', text: "Create DeFi app on Rootstock", category: "Start Guide" },
    { id: 'smart-contracts', text: "Tell me about smart contracts", category: "Learning" },
    { id: 'env-setup', text: "How to setup the environment", category: "Setup" },
    { id: 'frontend', text: "Frontend integration guide", category: "Development" },
    { id: 'deploy', text: "How to deploy contracts", category: "Deployment" },
    { id: 'resources', text: "Show me additional resources", category: "Resources" }
  ];

  return (
    <main className="max-w-[1100px] mx-auto">
      <section className="mx-auto flex flex-col items-center justify-center min-h-[60vh] mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-white">
          DeFather: Interactive Guide to DeFi on Rootstock
        </h1>
        
        <div className="w-full max-w-3xl bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Chat Commands</h2>
          <p className="text-gray-300 mb-6">Click on any command to add it to the chat input:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatCommands.map((command) => (
              <div key={command.id} className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">{command.category}</span>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-left transition-colors w-full"
                  onClick={() => addCommandToChat(command.text)}
                >
                  {command.text}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="my-10">
        <InfiniteScroll />
      </div>

      <div className="my-40">
        <Starters />
      </div>
    </main>
  );
}
