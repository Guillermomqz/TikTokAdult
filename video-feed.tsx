import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoCard from "./video-card";

interface VideoFeedProps {
  tab: "forYou" | "following";
  onOpenComments: (videoId: number) => void;
}

export default function VideoFeed({ tab, onOpenComments }: VideoFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: videos, isLoading } = useQuery({
    queryKey: ["/api/videos"],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight - 80; // Account for bottom nav
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white">Loading videos...</div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white">No videos available</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="scroll-snap-container"
    >
      {videos.map((video: any, index: number) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === currentIndex}
          onOpenComments={onOpenComments}
        />
      ))}
    </div>
  );
}
