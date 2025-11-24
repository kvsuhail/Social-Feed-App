import React from 'react';
import { Home, Search, PlusSquare, Heart, User, Compass } from 'lucide-react';
import { UserLabel } from '../types';
import { useSocial } from '../context/SocialContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onCreateClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateClick }) => {
  const { currentFilter, filterByLabel, notifications } = useSocial();
  const navigate = useNavigate();
  const location = useLocation();

  const labels = Object.values(UserLabel);
  const path = location.pathname;

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-800 p-6 z-40">
        <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">Nexus</h1>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-4">
            <NavButton 
              icon={<Home size={24} />} 
              label="Home" 
              active={path === '/'} 
              onClick={() => navigate('/')} 
            />
            <NavButton 
              icon={<Search size={24} />} 
              label="Search" 
              active={path === '/search'} 
              onClick={() => navigate('/search')} 
            />
            <NavButton 
              icon={<Compass size={24} />} 
              label="Explore" 
              active={path === '/explore'} 
              onClick={() => navigate('/search')} // Reusing search component for explore
            />
            <div className="relative">
                <NavButton 
                    icon={<Heart size={24} />} 
                    label="Notifications"
                    active={path === '/notifications'}
                    onClick={() => navigate('/notifications')} 
                />
                {hasUnread && (
                    <span className="absolute left-6 top-3 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
                )}
            </div>
            
            <button 
              onClick={onCreateClick}
              className="flex items-center space-x-4 px-2 py-3 w-full text-left text-white hover:bg-dark-800 rounded-lg transition-colors"
            >
              <PlusSquare size={24} />
              <span className="font-medium">Create</span>
            </button>
            <NavButton 
              icon={<User size={24} />} 
              label="Profile" 
              active={path === '/profile'} 
              onClick={() => navigate('/profile')} 
            />
          </div>

          <div className="pt-8 border-t border-dark-800">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Competition / Feeds</h3>
            <div className="space-y-1">
              <button
                 onClick={() => { filterByLabel('All'); navigate('/'); }}
                 className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${currentFilter === 'All' ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white'}`}
              >
                All Feed
              </button>
              {labels.map(label => (
                <button
                  key={label}
                  onClick={() => { filterByLabel(label); navigate('/'); }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${currentFilter === label ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:text-white'}`}
                >
                  {label}s
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900/90 backdrop-blur-lg border-t border-dark-800 z-40">
        <div className="flex justify-around items-center h-14 px-4">
          <NavButtonMobile icon={<Home size={24} />} active={path === '/'} onClick={() => navigate('/')} />
          <NavButtonMobile icon={<Search size={24} />} active={path === '/search'} onClick={() => navigate('/search')} />
          <button onClick={onCreateClick} className="text-white">
            <PlusSquare size={24} />
          </button>
          <div className="relative">
             <NavButtonMobile icon={<Heart size={24} />} active={path === '/notifications'} onClick={() => navigate('/notifications')} />
             {hasUnread && (
                <span className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
             )}
          </div>
          <NavButtonMobile icon={<User size={24} />} active={path === '/profile'} onClick={() => navigate('/profile')} />
        </div>
      </div>
    </>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-4 px-2 py-3 w-full text-left rounded-lg transition-colors ${active ? 'text-white font-bold' : 'text-gray-400 hover:bg-dark-800 hover:text-white'}`}
  >
    {icon}
    <span className={`${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

const NavButtonMobile: React.FC<{ icon: React.ReactNode, active?: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 ${active ? 'text-white' : 'text-gray-500'}`}
  >
    {icon}
  </button>
);

export default Sidebar;
