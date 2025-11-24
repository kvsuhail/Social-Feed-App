import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import PostCard from './PostCard';

const Search: React.FC = () => {
  const { searchPosts, posts } = useSocial();
  const [query, setQuery] = useState('');

  const filteredPosts = query ? searchPosts(query) : posts;
  
  // For the explore grid, we just grab all posts (random order simulation)
  // In a real app, this would be an algorithmically sorted list
  const explorePosts = [...posts].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 md:pb-0 min-h-screen">
      {/* Search Bar */}
      <div className="sticky top-0 bg-dark-900 z-10 p-4 border-b border-dark-800">
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2.5 bg-dark-800 border-none rounded-xl text-white placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:bg-dark-800 transition-colors"
            placeholder="Search users, posts, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-2 md:p-4">
        {query ? (
            <div className="max-w-xl mx-auto space-y-6 pt-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide px-2">Search Results</h3>
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                    No results found for "{query}"
                </div>
              )}
            </div>
        ) : (
            // Explore Grid (Masonry-ish using Grid)
            <div className="grid grid-cols-3 gap-1 md:gap-4">
                {explorePosts.map((post, index) => {
                    // Create a varied grid layout
                    const isLarge = index % 10 === 0; // Every 10th item is large
                    return (
                        <div 
                            key={post.id} 
                            className={`relative group cursor-pointer bg-dark-800 overflow-hidden ${isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1 aspect-square'}`}
                        >
                            <img src={post.imageUrl} alt="explore" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center space-x-1 text-white font-bold drop-shadow-md">
                                  <span className="text-xl">❤️</span>
                                  <span>{post.likes}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default Search;