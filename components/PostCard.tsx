import React, { useState, useRef } from 'react';
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
  const { toggleLike, toggleSave, addComment } = useSocial();
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    // Prevent default to avoid standard browser behaviors
    e.preventDefault();
    
    if (!post.isLikedByCurrentUser) {
      toggleLike(post.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 1000);
  };

  const handleSave = () => {
    toggleSave(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
    setShowComments(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.user.name}`,
          text: post.caption,
          url: window.location.href, // In a real app, this would be a permalink
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

      {/* Media Content (Image or Video) */}
      <div 
        className="w-full bg-dark-800 relative group cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        {post.mediaType === 'video' ? (
          <video 
            ref={videoRef}
            src={post.imageUrl} 
            className="w-full max-h-[600px] object-contain"
            controls
            playsInline
            loop
          />
        ) : (
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full max-h-[600px] object-cover" 
            loading="lazy" 
          />
        )}

        {/* Double Tap Heart Animation */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${showHeartOverlay ? 'opacity-100' : 'opacity-0'}`}>
           <Heart size={100} className="text-white fill-white drop-shadow-lg animate-bounce" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={handleLike} className={`${post.isLikedByCurrentUser ? 'text-red-500' : 'text-white'} transition-colors hover:opacity-80`}>
            <Heart size={24} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setShowComments(!showComments)} className="text-white hover:text-gray-300">
            <MessageCircle size={24} />
          </button>
          <button onClick={handleShare} className="text-white hover:text-gray-300">
            <Send size={24} />
          </button>
        </div>
        <button onClick={handleSave} className={`${post.isSaved ? 'text-white' : 'text-white'} hover:text-gray-300`}>
          <Bookmark size={24} fill={post.isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 space-y-2">
        <p className="font-semibold text-sm text-white">{post.likes} likes</p>
        <div className="text-sm text-gray-100">
          <span className="font-semibold mr-2">{post.user.name}</span>
          {post.caption}
        </div>
        
        {/* Comments Section */}
        {post.comments.length > 0 && (
            <button 
                onClick={() => setShowComments(!showComments)}
                className="text-gray-500 text-sm cursor-pointer"
            >
                {showComments ? 'Hide comments' : `View all ${post.comments.length} comments`}
            </button>
        )}

        {showComments && (
            <div className="space-y-3 pt-2">
                {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-2 text-sm">
                        <span className="font-semibold text-white text-xs">{comment.username}</span>
                        <span className="text-gray-200">{comment.text}</span>
                    </div>
                ))}
            </div>
        )}

        <p className="text-xs text-gray-500 uppercase">
          {post.timestamp.toLocaleDateString()}
        </p>

        {/* Add Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex items-center border-t border-dark-800 pt-3 mt-2">
            <input 
                type="text" 
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none text-white placeholder-gray-500"
            />
            {commentText && (
                <button type="submit" className="text-primary-500 font-semibold text-sm ml-2">Post</button>
            )}
        </form>
      </div>
    </div>
  );
};

export default PostCard;
