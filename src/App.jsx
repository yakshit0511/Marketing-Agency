import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, Users, Briefcase, Plus, Search } from 'lucide-react';
import CampaignsView from './components/CampaignsView';
import TeamWorkloadView from './components/TeamWorkloadView';
import ClientDashboardView from './components/ClientDashboardView';
import NewCampaignModal from './components/NewCampaignModal';
import { ToastProvider } from './contexts/ToastContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('Campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowNewCampaignModal(true);
      }
      if (e.key === 'Escape') {
        setShowNewCampaignModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isClientView = currentView === 'Client View';

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isClientView ? 'bg-[#fafafa]' : 'bg-background'}`}>
      {/* Sidebar */}
      {!isClientView && (
        <aside className="w-64 bg-[#14161f] border-r border-gray-800 flex flex-col z-20">
          <div className="p-6 flex flex-col items-center border-b border-gray-800/50">
            <svg viewBox="0 0 100 100" className="w-16 h-16 mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 15 75 C 35 95 65 95 85 75 C 65 90 35 90 15 75 Z" fill="#ea580c" />
              <path d="M 10 65 C 30 90 70 90 90 65 C 70 85 30 85 10 65 Z" fill="#0284c7" />
              
              <rect x="24" y="45" width="14" height="30" fill="#0284c7" rx="1"/>
              <rect x="43" y="30" width="14" height="45" fill="#16a34a" rx="1"/>
              <rect x="62" y="40" width="14" height="35" fill="#ea580c" rx="1"/>
              
              <path d="M 31 40 L 50 25 L 69 35" stroke="#0284c7" strokeWidth="2" />
              <circle cx="31" cy="40" r="4" fill="#0284c7" />
              <circle cx="50" cy="25" r="5" fill="#ea580c" />
              <circle cx="69" cy="35" r="4" fill="#16a34a" />
              
              <path d="M 25 60 L 43 75 L 75 45 L 70 40 L 43 65 L 30 55 Z" fill="#ffffff" />
            </svg>
            <h1 className="text-xl font-bold text-white tracking-wide">
              <span className="text-[#0284c7]">Campaign</span><span className="text-[#ea580c]">Flow</span>
            </h1>
            <p className="text-[8px] text-gray-400 tracking-wider uppercase mt-1 font-medium">Streamline. Manage. Deliver.</p>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button 
              onClick={() => setCurrentView('Campaigns')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${currentView === 'Campaigns' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span className="font-medium">Campaigns</span>
            </button>
            <button 
              onClick={() => setCurrentView('Tasks')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${currentView === 'Tasks' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <CheckSquare className="w-5 h-5 mr-3" />
              <span className="font-medium">Tasks</span>
            </button>
            <button 
              onClick={() => setCurrentView('Team Workload')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${currentView === 'Team Workload' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">Team Workload</span>
            </button>
            <div className="my-4 border-t border-gray-800 mx-2"></div>
            <button 
              onClick={() => setCurrentView('Client View')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-white/5`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              <span className="font-medium">Client View</span>
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className={`h-20 border-b flex items-center justify-between px-8 z-10 ${isClientView ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#14161f] border-gray-800'}`}>
          <div className="flex items-center space-x-6">
            <h2 className={`text-xl font-semibold ${isClientView ? 'text-gray-900' : 'text-white'}`}>
              {currentView}
            </h2>
            {isClientView && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                Client View Mode
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isClientView ? 'text-gray-400' : 'text-gray-500'}`} />
              <input 
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent transition-all w-64 ${
                  isClientView 
                    ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white' 
                    : 'bg-[#0f1117] border-gray-800 text-white focus:bg-[#1a1d27]'
                }`}
              />
            </div>
            
            {!isClientView && (
              <button 
                onClick={() => setShowNewCampaignModal(true)}
                className="flex items-center px-4 py-2 bg-accent hover:bg-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-accent/20 transition-all group"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Campaign
                <span className="ml-2 text-[10px] text-indigo-200 group-hover:text-white hidden sm:inline-block border border-indigo-400 rounded px-1">N</span>
              </button>
            )}
            
            {isClientView && (
              <button 
                onClick={() => setCurrentView('Campaigns')}
                className="text-sm font-medium text-gray-500 hover:text-indigo-600 underline"
              >
                Exit Client View
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="animate-in fade-in duration-500 w-full h-full">
            {currentView === 'Campaigns' && <CampaignsView searchQuery={searchQuery} />}
            {currentView === 'Team Workload' && <TeamWorkloadView />}
            {currentView === 'Client View' && <ClientDashboardView searchQuery={searchQuery} />}
            {currentView === 'Tasks' && (
              <div className="text-center py-20 text-gray-500">
                Task board view coming soon...
              </div>
            )}
          </div>
        </div>
      </main>

      {showNewCampaignModal && (
        <NewCampaignModal onClose={() => setShowNewCampaignModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
