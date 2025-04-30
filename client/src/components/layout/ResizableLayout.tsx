import { Outlet } from "react-router-dom";
import Chat from "@/components/chat/Chat";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";

export default function ResizableLayout(): JSX.Element {
  // Save panel sizes to localStorage when changed
  const handleLayoutChange = (sizes: number[]) => {
    localStorage.setItem("resizable-layout", JSON.stringify(sizes));
  };

  // Load saved sizes on initial load
  const getDefaultSizes = () => {
    const savedSizes = localStorage.getItem("resizable-layout");
    if (savedSizes) {
      try {
        return JSON.parse(savedSizes);
      } catch (e) {
        return [25, 75];
      }
    }
    return [25, 75];
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-background w-full rounded-md">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={handleLayoutChange}
        className="h-full w-full"
      >
        {/* Left panel (Chat) - 25% screen width */}
        <ResizablePanel 
          defaultSize={getDefaultSizes()[0]} 
          minSize={20}
          maxSize={40}
          className="p-2"
        >
          <Chat />
        </ResizablePanel>
        
        {/* Divider with visual indicator */}
        <ResizableHandle withHandle />
        
        {/* Right panel (Content) - 75% screen width */}
        <ResizablePanel defaultSize={getDefaultSizes()[1]} className="p-2">
          <div className="h-full overflow-auto rounded-md">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
