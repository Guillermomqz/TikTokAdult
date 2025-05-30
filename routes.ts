import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get videos feed
  app.get("/api/videos", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const videos = await storage.getVideos(limit, offset);
      
      // Get user info for each video
      const videosWithUsers = await Promise.all(
        videos.map(async (video) => {
          const user = await storage.getUser(video.userId);
          return { ...video, user };
        })
      );
      
      res.json(videosWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get specific video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const user = await storage.getUser(video.userId);
      res.json({ ...video, user });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Create video
  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });

  // Get comments for a video
  app.get("/api/videos/:id/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const comments = await storage.getCommentsByVideo(videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create comment
  app.post("/api/videos/:id/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        videoId
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Like/unlike video
  app.post("/api/videos/:id/like", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const isLiked = await storage.isVideoLiked(userId, videoId);
      
      if (isLiked) {
        await storage.unlikeVideo(userId, videoId);
        res.json({ liked: false });
      } else {
        await storage.likeVideo(userId, videoId);
        res.json({ liked: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Check if video is liked
  app.get("/api/videos/:id/like/:userId", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);
      
      const isLiked = await storage.isVideoLiked(userId, videoId);
      res.json({ liked: isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const videos = await storage.getVideosByUser(id);
      res.json({ ...user, videos });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Follow/unfollow user
  app.post("/api/users/:id/follow", async (req, res) => {
    try {
      const followingId = parseInt(req.params.id);
      const { followerId } = req.body;
      
      if (!followerId) {
        return res.status(400).json({ message: "Follower ID required" });
      }
      
      const isFollowing = await storage.isFollowing(followerId, followingId);
      
      if (isFollowing) {
        await storage.unfollowUser(followerId, followingId);
        res.json({ following: false });
      } else {
        await storage.followUser(followerId, followingId);
        res.json({ following: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle follow" });
    }
  });

  // Check if following user
  app.get("/api/users/:id/follow/:followerId", async (req, res) => {
    try {
      const followingId = parseInt(req.params.id);
      const followerId = parseInt(req.params.followerId);
      
      const isFollowing = await storage.isFollowing(followerId, followingId);
      res.json({ following: isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
