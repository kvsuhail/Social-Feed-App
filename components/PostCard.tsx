import React from 'react';
import { Post, UserLabel } from '../types';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface PostCardProps {
  post: Post;
}

const LabelBadge: React.FC<{ label: UserLabel }> = ({ label }) => {
  const colors: Record<UserLabel, string> = {
    [UserLabel.DEVELOPER]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [UserLabel.MUSICIAN]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    [UserLabel.ACTOR]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    [UserLabel.ARTIST]: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    [UserLabel.ENTREPRENEUR]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [UserLabel.EVERYONE]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${colors[label] || colors[UserLabel.EVERYONE]}`}>
      {label}
    </span>
  );
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLike } = useSocial();

  const handleLike = () => {
    toggleLike(post.id);
  };

  return (
    <div className="bg-dark-900 border-b border-dark-800 pb-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img src={post.user.avatarUrl} alt={post.user.handle} className="w-8 h-8 rounded-full object-cover" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-white">{post.user.name}</span>
              <LabelBadge label={post.user.label} />
            </div>
            <span className="text-xs text-gray-400">{post.user.handle}</span>
          </div>
        </div>
        <button className="text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-dark-800 overflow-hidden relative">
        <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className={`${post.isLikedByCurrentUser ? 'text-red-500' : 'text-white'} transition-colors`}>
            <Heart size={24} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />
          </button>
          <button className="text-white">
            <MessageCircle size={24} />
          </button>
          <button className="text-white">
            <Send size={24} />
          </button>
        </div>
        <button className="text-white">
          <Bookmark size={24} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 space-y-1">
        <p className="font-semibold text-sm text-white">{post.likes} likes</p>
        <div className="text-sm text-gray-100">
          <span className="font-semibold mr-2">{post.user.name}</span>
          {post.caption}
        </div>
        <p className="text-xs text-gray-500 uppercase mt-1">
          {post.timestamp.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
