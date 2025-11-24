import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import CreatePostModal from './components/CreatePostModal';
import { SocialProvider } from './context/SocialContext';

const AppContent: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 font-sans">
      <div className="flex justify-center">
        {/* Sidebar / Navigation */}
        <Sidebar onCreateClick={() => setCreateModalOpen(true)} />

        {/* Main Content Area */}
        <main className="w-full md:pl-64 lg:max-w-4xl min-h-screen">
          <Feed />
        </main>

        {/* Right Sidebar (Suggestions) - Desktop Only */}
        <div className="hidden lg:block w-80 fixed right-0 top-0 h-screen p-8 border-l border-dark-800 z-30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img src="https://picsum.photos/seed/me/150/150" alt="me" className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">arivera_dev</span>
                <span className="text-xs text-gray-400">Alex Rivera</span>
              </div>
            </div>
            <button className="text-primary-500 text-xs font-bold">Switch</button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-semibold text-sm">Suggested for you</span>
            <button className="text-white text-xs font-semibold">See All</button>
          </div>

          <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <img src={`https://picsum.photos/seed/${i+50}/150/150`} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex flex-col">
                       <span className="text-xs font-semibold">dev_jane</span>
                       <span className="text-[10px] text-gray-400">New to Instagram</span>
                    </div>
                 </div>
                 <button className="text-primary-500 text-xs font-bold">Follow</button>
               </div>
             ))}
          </div>
          
          <div className="mt-8 text-[11px] text-gray-500 uppercase leading-5">
            About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language
          </div>
          <div className="mt-4 text-[11px] text-gray-500 uppercase">
             © 2024 NEXUS FROM GEMINI
          </div>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <SocialProvider>
        <AppContent />
      </SocialProvider>
    </HashRouter>
  );
};

export default App;
