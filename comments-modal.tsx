import { useState } from "react";
import { X, Heart, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface CommentsModalProps {
  open: boolean;
  videoId: number | null;
  onClose: () => void;
}

export default function CommentsModal({ open, videoId, onClose }: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [currentUserId] = useState(1); // Mock current user ID
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: [`/api/videos/${videoId}/comments`],
    enabled: !!videoId && open,
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => 
      apiRequest("POST", `/api/videos/${videoId}/comments`, {
        text,
        userId: currentUserId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setCommentText("");
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate(commentText.trim());
    }
  };

  if (!videoId) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-96 p-0">
        <DialogHeader className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle>Comments</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-64">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading comments...</div>
          ) : comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.user.avatar}
                  alt="Commenter"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium">{comment.user.username}</span>{" "}
                    {comment.text}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    <button className="text-gray-400 text-xs">Reply</button>
                    <button className="text-gray-400 text-xs flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">No comments yet</div>
          )}
        </div>
        
        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-gray-800 text-white border-gray-600"
              placeholder="Add comment..."
            />
            <Button
              type="submit"
              disabled={!commentText.trim() || commentMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
