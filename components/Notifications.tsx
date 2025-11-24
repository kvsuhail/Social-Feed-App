import React, { useEffect } from 'react';
import { useSocial } from '../context/SocialContext';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, markNotificationsRead } = useSocial();

  // Mark all as read when this component mounts
  useEffect(() => {
    markNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
        case 'like': return <Heart size={16} className="text-white fill-red-500" />;
        case 'comment': return <MessageCircle size={16} className="text-white fill-blue-500" />;
        case 'follow': return <UserPlus size={16} className="text-white fill-purple-500" />;
        default: return <Heart size={16} />;
    }
  };

  const getIconBg = (type: string) => {
      switch(type) {
        case 'like': return 'bg-red-500';
        case 'comment': return 'bg-blue-500';
        case 'follow': return 'bg-purple-500';
        default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 md:pb-0 min-h-screen">
      <div className="p-4 border-b border-dark-800 sticky top-0 bg-dark-900 z-10">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
      </div>

      <div className="flex flex-col">
        {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Heart size={48} className="mb-4 text-gray-700" />
                <p>Activity on your posts will appear here.</p>
            </div>
        ) : (
            notifications.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map((notif) => (
                <div key={notif.id} className={`flex items-center justify-between p-4 border-b border-dark-800 ${!notif.isRead ? 'bg-dark-800/30' : ''}`}>
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="relative">
                            <img src={notif.user.avatarUrl} alt={notif.user.handle} className="w-10 h-10 rounded-full object-cover" />
                            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-dark-900 ${getIconBg(notif.type)}`}>
                                {getIcon(notif.type)}
                            </div>
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-white mr-1">{notif.user.handle}</span>
                            <span className="text-gray-300">{notif.message}</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(notif.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {notif.type === 'follow' ? (
                        <button className="bg-primary-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-primary-700">
                            Follow
                        </button>
                    ) : (
                         notif.previewImage && (
                            <img src={notif.previewImage} alt="preview" className="w-10 h-10 object-cover rounded" />
                         )
                    )}
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
