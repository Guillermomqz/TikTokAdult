import { Home, Compass, Plus, Mail, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: "home" | "discover" | "inbox" | "profile";
  onOpenUpload: () => void;
}

export default function BottomNavigation({ activeTab, onOpenUpload }: BottomNavigationProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black border-t border-gray-800">
      <div className="flex items-center justify-around py-2">
        <Link href="/" className="flex flex-col items-center py-2">
          <Home className={`w-6 h-6 ${activeTab === "home" ? "text-white" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${activeTab === "home" ? "text-white" : "text-gray-400"}`}>
            Home
          </span>
        </Link>
        
        <button className="flex flex-col items-center py-2">
          <Compass className={`w-6 h-6 ${activeTab === "discover" ? "text-white" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${activeTab === "discover" ? "text-white" : "text-gray-400"}`}>
            Discover
          </span>
        </button>
        
        <Button
          onClick={onOpenUpload}
          className="w-12 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center p-0"
        >
          <Plus className="w-5 h-5 text-black font-bold" />
        </Button>
        
        <button className="flex flex-col items-center py-2">
          <Mail className={`w-6 h-6 ${activeTab === "inbox" ? "text-white" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${activeTab === "inbox" ? "text-white" : "text-gray-400"}`}>
            Inbox
          </span>
        </button>
        
        <Link href="/profile/1" className="flex flex-col items-center py-2">
          <User className={`w-6 h-6 ${activeTab === "profile" ? "text-white" : "text-gray-400"}`} />
          <span className={`text-xs mt-1 ${activeTab === "profile" ? "text-white" : "text-gray-400"}`}>
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
