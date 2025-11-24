import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, User, UserLabel, Story, Notification, Comment } from '../types';
import { generateFeedContent } from '../services/geminiService';

interface SocialContextType {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  isLoading: boolean;
  loadMorePosts: () => Promise<void>;
  createPost: (caption: string, file: File) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  filterByLabel: (label: UserLabel | 'All') => void;
  currentFilter: UserLabel | 'All';
  searchPosts: (query: string) => Post[];
  markNotificationsRead: () => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const CURRENT_USER: User = {
  id: 'current-user-suhail',
  name: 'Suhail KV',
  handle: '@zalaa___0',
  avatarUrl: 'https://picsum.photos/seed/zalaa___0/150/150',
  label: UserLabel.DEVELOPER,
  followers: 2450,
  following: 420,
  bio: 'Frontend Developer 👨‍💻 | React & Flutter Enthusiast | Building cool things 🚀'
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<UserLabel | 'All'>('All');

  // Load initial Data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const newPosts = await generateFeedContent(5);
      
      // Add a few posts for the current user to populate the profile initially
      const myInitialPosts: Post[] = [
        {
          id: 'my-post-1',
          userId: CURRENT_USER.id,
          user: CURRENT_USER,
          imageUrl: 'https://picsum.photos/seed/mycode1/800/800',
          mediaType: 'image',
          caption: 'Working on the new social app! 🚀 #coding #flutter #react',
          likes: 120,
          comments: [],
          timestamp: new Date(),
          isLikedByCurrentUser: false,
          isSaved: false
        },
        {
          id: 'my-post-2',
          userId: CURRENT_USER.id,
          user: CURRENT_USER,
          imageUrl: 'https://picsum.photos/seed/mysetup2/800/800',
          mediaType: 'image',
          caption: 'My dev setup for tonight. Dark mode everything. 🌙',
          likes: 85,
          comments: [],
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          isLikedByCurrentUser: false,
          isSaved: false
        }
      ];

      setPosts([...myInitialPosts, ...newPosts]);
      
      // Generate some dummy stories
      const dummyStories: Story[] = newPosts.map(p => ({
        id: `story-${p.id}`,
        userId: p.userId,
        user: p.user,
        imageUrl: p.imageUrl,
        isViewed: false
      }));
      setStories(dummyStories);

      // Generate some dummy notifications
      setNotifications([
        {
          id: 'notif-1',
          type: 'like',
          user: newPosts[0]?.user || CURRENT_USER,
          message: 'liked your photo.',
          previewImage: myInitialPosts[0].imageUrl,
          timestamp: new Date(Date.now() - 3600000),
          isRead: false
        },
        {
          id: 'notif-2',
          type: 'follow',
          user: newPosts[1]?.user || CURRENT_USER,
          message: 'started following you.',
          timestamp: new Date(Date.now() - 7200000),
          isRead: false
        }
      ]);
      
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMorePosts = useCallback(async () => {
    const newPosts = await generateFeedContent(3);
    setPosts(prev => [...prev, ...newPosts]);
  }, []);

  const createPost = (caption: string, file: File) => {
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: CURRENT_USER.id,
      user: CURRENT_USER,
      imageUrl: URL.createObjectURL(file),
      mediaType: mediaType,
      caption: caption,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      isLikedByCurrentUser: false,
      isSaved: false
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isNowLiked = !post.isLikedByCurrentUser;
        
        // Mock notification if liking someone else's post (simulated)
        if (isNowLiked && post.userId !== CURRENT_USER.id) {
           // In a real app, this goes to the backend. 
           // Here we won't add to our own notifications because we are the actor.
        }

        return {
          ...post,
          likes: isNowLiked ? post.likes + 1 : post.likes - 1,
          isLikedByCurrentUser: isNowLiked
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      userId: CURRENT_USER.id,
      username: CURRENT_USER.handle,
      avatarUrl: CURRENT_USER.avatarUrl,
      text: text,
      timestamp: new Date()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const toggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };

  const filterByLabel = (label: UserLabel | 'All') => {
    setCurrentFilter(label);
  };

  const searchPosts = (query: string) => {
    if (!query) return posts;
    const lowerQuery = query.toLowerCase();
    return posts.filter(p => 
      p.caption.toLowerCase().includes(lowerQuery) || 
      p.user.name.toLowerCase().includes(lowerQuery) ||
      p.user.handle.toLowerCase().includes(lowerQuery)
    );
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredPosts = currentFilter === 'All' 
    ? posts 
    : posts.filter(p => p.user.label === currentFilter);

  return (
    <SocialContext.Provider value={{
      currentUser: CURRENT_USER,
      posts: filteredPosts,
      stories,
      notifications,
      isLoading,
      loadMorePosts,
      createPost,
      toggleLike,
      toggleSave,
      addComment,
      filterByLabel,
      currentFilter,
      searchPosts,
      markNotificationsRead
    }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
