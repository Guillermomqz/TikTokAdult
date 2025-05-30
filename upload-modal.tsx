import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuets, setAllowDuets] = useState(true);

  const handleUpload = () => {
    // Mock upload functionality
    console.log("Uploading video...", { caption, privacy, allowComments, allowDuets });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
            <DialogTitle>Create Video</DialogTitle>
            <Button 
              onClick={handleUpload}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm"
            >
              Post
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Select video to upload</p>
            <p className="text-gray-400 text-sm mb-4">Or drag and drop a file</p>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Select file
            </Button>
          </div>
          
          {/* Video Details Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="caption" className="text-white text-sm font-medium">
                Caption
              </Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-gray-800 text-white border-gray-600 mt-2"
                rows={3}
                placeholder="Describe your video..."
              />
            </div>
            
            <div>
              <Label htmlFor="privacy" className="text-white text-sm font-medium">
                Privacy
              </Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger className="bg-gray-800 text-white border-gray-600 mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="comments" className="text-white text-sm">
                Allow comments
              </Label>
              <Switch
                id="comments"
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="duets" className="text-white text-sm">
                Allow duets
              </Label>
              <Switch
                id="duets"
                checked={allowDuets}
                onCheckedChange={setAllowDuets}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
