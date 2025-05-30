import { useState } from "react";
import VideoFeed from "@/components/video-feed";
import TopNavigation from "@/components/top-navigation";
import BottomNavigation from "@/components/bottom-navigation";
import UploadModal from "@/components/upload-modal";
import CommentsModal from "@/components/comments-modal";
import SearchModal from "@/components/search-modal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  const handleOpenComments = (videoId: number) => {
    setSelectedVideoId(videoId);
    setShowCommentsModal(true);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <TopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setShowSearchModal(true)}
      />
      
      <VideoFeed
        tab={activeTab}
        onOpenComments={handleOpenComments}
      />
      
      <BottomNavigation
        activeTab="home"
        onOpenUpload={() => setShowUploadModal(true)}
      />

      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <CommentsModal
        open={showCommentsModal}
        videoId={selectedVideoId}
        onClose={() => setShowCommentsModal(false)}
      />

      <SearchModal
        open={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      <div id="floating-hearts" className="floating-hearts" />
    </div>
  );
}
