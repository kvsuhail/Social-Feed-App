import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, User, UserLabel, Story } from '../types';
import { generateFeedContent } from '../services/geminiService';

interface SocialContextType {
  currentUser: User;
  posts: Post[];
  stories: Story[];
  isLoading: boolean;
  loadMorePosts: () => Promise<void>;
  createPost: (caption: string, imageFile: File) => void;
  toggleLike: (postId: string) => void;
  filterByLabel: (label: UserLabel | 'All') => void;
  currentFilter: UserLabel | 'All';
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const CURRENT_USER: User = {
  id: 'current-user',
  name: 'Alex Rivera',
  handle: '@arivera_dev',
  avatarUrl: 'https://picsum.photos/seed/me/150/150',
  label: UserLabel.DEVELOPER,
  followers: 1205
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<UserLabel | 'All'>('All');

  // Load initial Data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const newPosts = await generateFeedContent(5);
      setPosts(newPosts);
      
      // Generate some dummy stories
      const dummyStories: Story[] = newPosts.map(p => ({
        id: `story-${p.id}`,
        userId: p.userId,
        user: p.user,
        imageUrl: p.imageUrl,
        isViewed: false
      }));
      setStories(dummyStories);
      
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMorePosts = useCallback(async () => {
    // Avoid re-fetching if already loading to prevent race conditions
    // However, for infinite scroll, we usually manage a separate 'fetching' state or debouncer.
    // For simplicity here:
    const newPosts = await generateFeedContent(3);
    setPosts(prev => [...prev, ...newPosts]);
  }, []);

  const createPost = (caption: string, imageFile: File) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: CURRENT_USER.id,
      user: CURRENT_USER,
      imageUrl: URL.createObjectURL(imageFile),
      caption: caption,
      likes: 0,
      comments: [],
      timestamp: new Date(),
      isLikedByCurrentUser: false
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLikedByCurrentUser ? post.likes - 1 : post.likes + 1,
          isLikedByCurrentUser: !post.isLikedByCurrentUser
        };
      }
      return post;
    }));
  };

  const filterByLabel = (label: UserLabel | 'All') => {
    setCurrentFilter(label);
  };

  const filteredPosts = currentFilter === 'All' 
    ? posts 
    : posts.filter(p => p.user.label === currentFilter);

  return (
    <SocialContext.Provider value={{
      currentUser: CURRENT_USER,
      posts: filteredPosts,
      stories,
      isLoading,
      loadMorePosts,
      createPost,
      toggleLike,
      filterByLabel,
      currentFilter
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
