import { Wifi, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  activeTab: "forYou" | "following";
  onTabChange: (tab: "forYou" | "following") => void;
  onOpenSearch: () => void;
}

export default function TopNavigation({ activeTab, onTabChange, onOpenSearch }: TopNavigationProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" className="text-white">
          <Wifi className="w-5 h-5" />
        </Button>
        
        <div className="flex space-x-6">
          <button
            onClick={() => onTabChange("following")}
            className={`text-lg font-medium pb-1 ${
              activeTab === "following"
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => onTabChange("forYou")}
            className={`text-lg font-medium pb-1 ${
              activeTab === "forYou"
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
          >
            For You
          </button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={onOpenSearch}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
