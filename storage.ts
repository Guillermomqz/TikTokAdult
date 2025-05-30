import { 
  users, videos, comments, likes, follows,
  type User, type InsertUser,
  type Video, type InsertVideo,
  type Comment, type InsertComment,
  type Like, type InsertLike,
  type Follow, type InsertFollow
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Videos
  getVideos(limit?: number, offset?: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Comments
  getCommentsByVideo(videoId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Likes
  isVideoLiked(userId: number, videoId: number): Promise<boolean>;
  likeVideo(userId: number, videoId: number): Promise<void>;
  unlikeVideo(userId: number, videoId: number): Promise<void>;
  
  // Follows
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  followUser(followerId: number, followingId: number): Promise<void>;
  unfollowUser(followerId: number, followingId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private comments: Map<number, Comment>;
  private likes: Map<string, Like>;
  private follows: Map<string, Follow>;
  private currentUserId: number;
  private currentVideoId: number;
  private currentCommentId: number;
  private currentLikeId: number;
  private currentFollowId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.follows = new Map();
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentCommentId = 1;
    this.currentLikeId = 1;
    this.currentFollowId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers = [
      { username: "@sophia_dance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
      { username: "@chef_marco", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
      { username: "@style_luna", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c6cd?w=80&h=80&fit=crop&crop=face" },
      { username: "@fitness_mike", avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face" },
      { username: "@travel_sarah", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face" },
      { username: "@alex_cool", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" }
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        username: userData.username,
        avatar: userData.avatar,
        followers: Math.floor(Math.random() * 1000000),
        following: Math.floor(Math.random() * 500)
      };
      this.users.set(user.id, user);
    });

    // Create sample videos
    const sampleVideos = [
      {
        userId: 1,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=800&fit=crop",
        description: "Sunset vibes in the city 🌅 #dance #sunset #vibes",
        music: "Original Sound - sophia_dance"
      },
      {
        userId: 2,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=800&fit=crop",
        description: "Perfect pasta in 60 seconds! 🍝 #cooking #pasta #recipe",
        music: "Cooking Beat - TrendyTunes"
      },
      {
        userId: 3,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=800&fit=crop",
        description: "Thrift flip transformation ✨ #fashion #thrift #style",
        music: "Fashion Week - StyleSounds"
      },
      {
        userId: 4,
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=800&fit=crop",
        description: "Morning workout routine 💪 #fitness #workout #motivation",
        music: "Workout Beats - FitMusic"
      }
    ];

    sampleVideos.forEach(videoData => {
      const video: Video = {
        id: this.currentVideoId++,
        userId: videoData.userId,
        videoUrl: videoData.videoUrl,
        thumbnailUrl: videoData.thumbnailUrl,
        description: videoData.description,
        music: videoData.music,
        likes: Math.floor(Math.random() * 50000),
        comments: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        createdAt: new Date()
      };
      this.videos.set(video.id, video);
    });

    // Create sample comments
    const sampleComments = [
      { videoId: 1, userId: 6, text: "This is amazing! 🔥" },
      { videoId: 1, userId: 4, text: "What's the song name?" },
      { videoId: 1, userId: 5, text: "Tutorial please! 💃" },
      { videoId: 2, userId: 1, text: "Making this tonight!" },
      { videoId: 2, userId: 3, text: "Looks delicious 😋" }
    ];

    sampleComments.forEach(commentData => {
      const comment: Comment = {
        id: this.currentCommentId++,
        videoId: commentData.videoId,
        userId: commentData.userId,
        text: commentData.text,
        likes: Math.floor(Math.random() * 100),
        createdAt: new Date()
      };
      this.comments.set(comment.id, comment);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      followers: 0,
      following: 0
    };
    this.users.set(user.id, user);
    return user;
  }

  async getVideos(limit = 20, offset = 0): Promise<Video[]> {
    const allVideos = Array.from(this.videos.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allVideos.slice(offset, offset + limit);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => video.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const video: Video = {
      id: this.currentVideoId++,
      ...insertVideo,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date()
    };
    this.videos.set(video.id, video);
    return video;
  }

  async getCommentsByVideo(videoId: number): Promise<(Comment & { user: User })[]> {
    const videoComments = Array.from(this.comments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return videoComments.map(comment => ({
      ...comment,
      user: this.users.get(comment.userId)!
    }));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const comment: Comment = {
      id: this.currentCommentId++,
      ...insertComment,
      likes: 0,
      createdAt: new Date()
    };
    this.comments.set(comment.id, comment);

    // Increment comment count on video
    const video = this.videos.get(insertComment.videoId);
    if (video) {
      video.comments++;
      this.videos.set(video.id, video);
    }

    return comment;
  }

  async isVideoLiked(userId: number, videoId: number): Promise<boolean> {
    const key = `${userId}-${videoId}`;
    return this.likes.has(key);
  }

  async likeVideo(userId: number, videoId: number): Promise<void> {
    const key = `${userId}-${videoId}`;
    if (!this.likes.has(key)) {
      const like: Like = {
        id: this.currentLikeId++,
        userId,
        videoId,
        createdAt: new Date()
      };
      this.likes.set(key, like);

      // Increment like count on video
      const video = this.videos.get(videoId);
      if (video) {
        video.likes++;
        this.videos.set(video.id, video);
      }
    }
  }

  async unlikeVideo(userId: number, videoId: number): Promise<void> {
    const key = `${userId}-${videoId}`;
    if (this.likes.has(key)) {
      this.likes.delete(key);

      // Decrement like count on video
      const video = this.videos.get(videoId);
      if (video) {
        video.likes = Math.max(0, video.likes - 1);
        this.videos.set(video.id, video);
      }
    }
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const key = `${followerId}-${followingId}`;
    return this.follows.has(key);
  }

  async followUser(followerId: number, followingId: number): Promise<void> {
    const key = `${followerId}-${followingId}`;
    if (!this.follows.has(key) && followerId !== followingId) {
      const follow: Follow = {
        id: this.currentFollowId++,
        followerId,
        followingId,
        createdAt: new Date()
      };
      this.follows.set(key, follow);

      // Update follower/following counts
      const follower = this.users.get(followerId);
      const following = this.users.get(followingId);
      if (follower) {
        follower.following++;
        this.users.set(follower.id, follower);
      }
      if (following) {
        following.followers++;
        this.users.set(following.id, following);
      }
    }
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    const key = `${followerId}-${followingId}`;
    if (this.follows.has(key)) {
      this.follows.delete(key);

      // Update follower/following counts
      const follower = this.users.get(followerId);
      const following = this.users.get(followingId);
      if (follower) {
        follower.following = Math.max(0, follower.following - 1);
        this.users.set(follower.id, follower);
      }
      if (following) {
        following.followers = Math.max(0, following.followers - 1);
        this.users.set(following.id, following);
      }
    }
  }
}

export const storage = new MemStorage();
