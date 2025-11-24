import React, { useEffect, useRef } from 'react';
import PostCard from './PostCard';
import StoryRail from './StoryRail';
import { useSocial } from '../context/SocialContext';
import { Loader2 } from 'lucide-react';

const Feed: React.FC = () => {
  const { posts, loadMorePosts, isLoading, currentFilter } = useSocial();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set up observer if we aren't already loading
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMorePosts();
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMorePosts, isLoading]);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto md:max-w-xl pb-20 md:pb-0">
      <StoryRail />
      
      {currentFilter !== 'All' && (
         <div className="px-4 py-2 text-sm text-gray-400 flex items-center justify-between">
            <span>Filtered by: <span className="text-primary-400 font-semibold">{currentFilter}</span></span>
         </div>
      )}

      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-20 flex items-center justify-center w-full py-4 text-gray-500">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">Generating content with Gemini...</span>
          </div>
        ) : (
          <span className="text-sm">Scroll for more</span>
        )}
      </div>
    </div>
  );
};

export default Feed;
