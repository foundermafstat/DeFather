import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Button from "./ui/button";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function Navbar(): JSX.Element {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();
  const { open } = useAppKit();
  useEffect(() => {
    console.log({
      address,
      isConnected,
      caipAddress,
      status,
      embeddedWalletInfo,
    });
  }, [address, isConnected, caipAddress, status, embeddedWalletInfo]);
  return (
    <nav className="sticky top-4 flex items-center justify-between py-3 px-5 rounded-full mt-4 w-full max-w-[1200px] mx-auto bg-gray-600/20 backdrop-blur-lg z-[100]">
      <Link to="/" className="text-white font-bold text-lg hover:text-gray-300 transition-colors">
        DeFather
      </Link>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/aa" className="text-white hover:text-gray-300 transition-colors">
            Abstraction
          </Link>
          <Link to="/wagmi" className="text-white hover:text-gray-300 transition-colors">
            Wagmi
          </Link>
          <Link to="/guide" className="text-white hover:text-gray-300 transition-colors">
            DeFi Guide
          </Link>
        </div>
			
        {!isConnected ? (
          <Button onClick={() => open()}>Connect</Button>
        ) : (
          <appkit-account-button />
        )}
      </div>
    </nav>
  );
}
