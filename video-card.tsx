import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share, Music } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatCount, createFloatingHearts } from "@/lib/hooks";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  video: any;
  isActive: boolean;
  onOpenComments: (videoId: number) => void;
}

export default function VideoCard({ video, isActive, onOpenComments }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();
  const [currentUserId] = useState(1); // Mock current user ID
  
  const { data: likeStatus } = useQuery({
    queryKey: [`/api/videos/${video.id}/like/${currentUserId}`],
    enabled: !!video.id,
  });

  const { data: followStatus } = useQuery({
    queryKey: [`/api/users/${video.userId}/follow/${currentUserId}`],
    enabled: !!video.userId && video.userId !== currentUserId,
  });

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/videos/${video.id}/like`, { userId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${video.id}/like/${currentUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
  });

  const followMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/users/${video.userId}/follow`, { followerId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${video.userId}/follow/${currentUserId}`] });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLElement;
    
    if (!likeStatus?.liked) {
      createFloatingHearts(button);
    }
    
    likeMutation.mutate();
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    followMutation.mutate();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/video/${video.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this video on TikTokAdult`,
          text: video.description,
          url: url,
        });
      } catch (error) {
        // User cancelled the share
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        // Show toast notification (simplified)
        console.log('Link copied to clipboard!');
      } catch (error) {
        console.log('Failed to copy link');
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div className="video-container relative w-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        poster={video.thumbnailUrl}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      {/* Video Overlay Info */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <div className="flex items-center mb-2">
          <img
            src={video.user?.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-white mr-3"
          />
          <span className="font-semibold text-white">{video.user?.username}</span>
          {video.userId !== currentUserId && (
            <Button
              onClick={handleFollow}
              disabled={followMutation.isPending}
              className="ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium"
            >
              {followStatus?.following ? "Following" : "Follow"}
            </Button>
          )}
        </div>
        <p className="text-white text-sm mb-1">{video.description}</p>
        <p className="text-white text-xs flex items-center">
          <Music className="w-3 h-3 mr-2" />
          {video.music}
        </p>
      </div>

      {/* Engagement Sidebar */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-10">
        <button
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="engagement-btn flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center">
            <Heart
              className={`w-6 h-6 ${
                likeStatus?.liked ? "text-red-500 fill-current" : "text-white"
              } ${likeMutation.isPending ? "animate-pulse" : ""}`}
            />
          </div>
          <span className="text-white text-xs mt-1">{formatCount(video.likes)}</span>
        </button>

        <button
          onClick={() => onOpenComments(video.id)}
          className="engagement-btn flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">{formatCount(video.comments)}</span>
        </button>

        <button
          onClick={handleShare}
          className="engagement-btn flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center">
            <Share className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Share</span>
        </button>

        {/* Rotating profile disc */}
        <div className="w-12 h-12 relative">
          <img
            src={video.user?.avatar}
            alt="Profile"
            className="w-full h-full rounded-full border-2 border-white rotating-disc"
          />
        </div>
      </div>
    </div>
  );
}
