import React from 'react';
import { useSocial } from '../context/SocialContext';
import { Plus } from 'lucide-react';

const StoryRail: React.FC = () => {
  const { stories, currentUser } = useSocial();

  return (
    <div className="w-full bg-dark-900 border-b border-dark-800 py-4 mb-2">
      <div className="flex space-x-4 overflow-x-auto px-4 no-scrollbar">
        {/* Current User Story Add */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
          <div className="relative w-16 h-16">
            <img 
              src={currentUser.avatarUrl} 
              alt="My Story" 
              className="w-full h-full rounded-full object-cover border-2 border-dark-700 opacity-75"
            />
            <div className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-1 border-2 border-dark-900">
              <Plus size={14} className="text-white" />
            </div>
          </div>
          <span className="text-xs text-gray-400">Your Story</span>
        </div>

        {/* Other Users Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
            <div className={`w-16 h-16 rounded-full p-[2px] ${story.isViewed ? 'bg-dark-700' : 'bg-gradient-to-tr from-yellow-400 to-primary-600'}`}>
              <img 
                src={story.user.avatarUrl} 
                alt={story.user.handle} 
                className="w-full h-full rounded-full object-cover border-2 border-dark-900"
              />
            </div>
            <span className="text-xs text-gray-300 truncate w-16 text-center">{story.user.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryRail;
