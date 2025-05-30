import { useState } from "react";
import { ArrowLeft, Search, Hash, Flame } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCount } from "@/lib/hooks";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock trending hashtags
  const trendingHashtags = [
    { tag: "#dance", views: 2500000 },
    { tag: "#cooking", views: 1800000 },
    { tag: "#fashion", views: 3200000 },
    { tag: "#fitness", views: 1200000 },
    { tag: "#travel", views: 950000 },
  ];

  // Mock suggested users
  const suggestedUsers = [
    {
      id: 4,
      username: "@fitness_mike",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face",
      followers: 2100000,
    },
    {
      id: 5,
      username: "@travel_sarah",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=50&h=50&fit=crop&crop=face",
      followers: 856000,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-gray-800 text-white max-w-full h-full m-0 p-0">
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <div className="flex items-center p-4 pt-12 border-b border-gray-800">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white border-gray-600 pl-10"
                placeholder="Search users, sounds, hashtags..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Trending</h3>
              <div className="space-y-3">
                {trendingHashtags.map((hashtag, index) => (
                  <div key={hashtag.tag} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hash className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">{hashtag.tag}</p>
                        <p className="text-gray-400 text-sm">
                          {formatCount(hashtag.views)} videos
                        </p>
                      </div>
                    </div>
                    <Flame className="w-5 h-5 text-red-500" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Suggested Users</h3>
              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-gray-400 text-sm">
                          {formatCount(user.followers)} followers
                        </p>
                      </div>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
