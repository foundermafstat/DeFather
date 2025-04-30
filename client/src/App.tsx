import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { Etherspot, Home, Wagmi } from "@/pages";
import ResizableLayout from "@/components/layout/ResizableLayout";
import { ChatProvider } from "@/context/ChatContext";
import { GuideProvider } from "@/context/GuideContext";
import DeFatherGuide from "@/pages/interactive/DeFatherGuide";

function App() {
  return (
    <ChatProvider>
      <GuideProvider>
        <Router>
          <main className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <Routes>
              {/* Main routes that use ResizableLayout */}
              <Route element={<ResizableLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/aa" element={<Etherspot />} />
                <Route path="/wagmi" element={<Wagmi />} />
                <Route path="/guide" element={<DeFatherGuide />} />
              </Route>
            </Routes>
            {/* <Footer /> */}
            <Toaster />
          </main>
        </Router>
      </GuideProvider>
    </ChatProvider>
  );
}

export default App;
