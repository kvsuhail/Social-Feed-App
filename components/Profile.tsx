import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import { Settings, Grid, Bookmark, UserSquare2 } from 'lucide-react';
import { UserLabel } from '../types';

const Profile: React.FC = () => {
  const { currentUser, posts } = useSocial();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  const myPosts = posts.filter(p => p.userId === currentUser.id);
  const savedPosts = posts.filter(p => p.isSaved);

  const displayPosts = activeTab === 'saved' ? savedPosts : (activeTab === 'tagged' ? [] : myPosts);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 md:pb-0 text-white">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-12">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-primary-600 p-[3px]">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-full h-full rounded-full object-cover border-4 border-dark-900"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col space-y-4 w-full md:w-auto">
          {/* Handle & Actions */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <h2 className="text-xl font-light">{currentUser.handle.replace('@', '')}</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-1.5 bg-dark-800 rounded-lg text-sm font-semibold hover:bg-dark-700 transition-colors">
                Edit profile
              </button>
              <button className="px-4 py-1.5 bg-dark-800 rounded-lg text-sm font-semibold hover:bg-dark-700 transition-colors">
                View archive
              </button>
              <button className="p-1.5 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around md:justify-start md:space-x-10 border-t border-dark-800 md:border-none py-4 md:py-0">
            <div className="flex flex-col md:flex-row items-center md:space-x-1">
              <span className="font-bold">{myPosts.length}</span>
              <span className="text-gray-400 md:text-white">posts</span>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-1">
              <span className="font-bold">{currentUser.followers}</span>
              <span className="text-gray-400 md:text-white">followers</span>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-1">
              <span className="font-bold">{currentUser.following}</span>
              <span className="text-gray-400 md:text-white">following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="px-4 md:px-0 text-center md:text-left space-y-1">
            <div className="font-semibold flex items-center justify-center md:justify-start space-x-2">
              <span>{currentUser.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] uppercase font-bold border border-primary-500/30">
                {currentUser.label}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm">{currentUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Highlights (Mock) */}
      <div className="flex space-x-6 px-6 pb-8 overflow-x-auto no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-dark-900 overflow-hidden">
                <img src={`https://picsum.photos/seed/highlight${i}/100/100`} alt="highlight" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
            <span className="text-xs text-white">Highlight</span>
          </div>
        ))}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
           <div className="w-16 h-16 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
             <div className="w-14 h-14 rounded-full bg-dark-900 flex items-center justify-center">
               <span className="text-2xl text-gray-500">+</span>
             </div>
           </div>
           <span className="text-xs text-white">New</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-dark-800">
        <div className="flex justify-center space-x-12">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 py-4 border-t-2 text-xs uppercase tracking-widest ${activeTab === 'posts' ? 'border-white text-white' : 'border-transparent text-gray-500'}`}
          >
            <Grid size={16} />
            <span className="hidden md:inline">Posts</span>
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 py-4 border-t-2 text-xs uppercase tracking-widest ${activeTab === 'saved' ? 'border-white text-white' : 'border-transparent text-gray-500'}`}
          >
            <Bookmark size={16} />
            <span className="hidden md:inline">Saved</span>
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center space-x-2 py-4 border-t-2 text-xs uppercase tracking-widest ${activeTab === 'tagged' ? 'border-white text-white' : 'border-transparent text-gray-500'}`}
          >
            <UserSquare2 size={16} />
            <span className="hidden md:inline">Tagged</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4 px-0 md:px-0">
          {displayPosts.map((post) => (
            <div key={post.id} className="relative aspect-square group cursor-pointer bg-dark-800 overflow-hidden">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white">
                <div className="flex items-center space-x-1 font-bold">
                  <span className="text-lg">❤️</span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 font-bold">
                  <span className="text-lg">💬</span>
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="p-4 rounded-full border-2 border-dark-700 mb-4">
            {activeTab === 'saved' ? <Bookmark size={48} strokeWidth={1} /> : <Grid size={48} strokeWidth={1} />}
          </div>
          <h3 className="text-xl font-light">
            {activeTab === 'saved' ? 'No saved posts yet.' : 'No posts yet.'}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Profile;