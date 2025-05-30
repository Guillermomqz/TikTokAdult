import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Grid, Heart, MessageCircle, Share } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/hooks";

export default function Profile() {
  const { id } = useParams();
  const userId = parseInt(id || "1");

  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 border-b border-gray-800">
        <Link href="/" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">{user.username}</h1>
        <div className="w-6 h-6" />
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center p-6">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-24 h-24 rounded-full border-2 border-white mb-4"
        />
        
        <h2 className="text-xl font-bold mb-2">{user.username}</h2>
        
        <div className="flex space-x-6 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold">{formatCount(user.following)}</div>
            <div className="text-xs text-gray-400">Following</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{formatCount(user.followers)}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{formatCount(user.videos?.reduce((sum: number, video: any) => sum + video.likes, 0) || 0)}</div>
            <div className="text-xs text-gray-400">Likes</div>
          </div>
        </div>

        <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-md">
          Follow
        </Button>
      </div>

      {/* Videos Grid */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-center mb-4">
          <Grid className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Videos</span>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          {user.videos?.map((video: any) => (
            <div key={video.id} className="relative aspect-[9/16] bg-gray-800">
              <img
                src={video.thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover rounded-sm"
              />
              
              {/* Video stats overlay */}
              <div className="absolute bottom-1 left-1 flex items-center space-x-1">
                <Heart className="w-3 h-3 text-white" />
                <span className="text-xs text-white">{formatCount(video.likes)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {(!user.videos || user.videos.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">No videos yet</div>
          </div>
        )}
      </div>
    </div>
  );
}
