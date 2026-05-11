import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, Users, Briefcase, Plus, Search, X, Menu } from 'lucide-react';
import CampaignsView from './components/CampaignsView';
import TeamWorkloadView from './components/TeamWorkloadView';
import ClientDashboardView from './components/ClientDashboardView';
import NewCampaignModal from './components/NewCampaignModal';
import { ToastProvider } from './contexts/ToastContext';

const NAV_ITEMS = [
  { label: 'Campaigns',     icon: LayoutDashboard, view: 'Campaigns' },
  { label: 'Tasks',         icon: CheckSquare,     view: 'Tasks' },
  { label: 'Team',          icon: Users,            view: 'Team Workload' },
  { label: 'Client View',   icon: Briefcase,        view: 'Client View' },
];

function AppContent() {
  const [currentView, setCurrentView] = useState('Campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setShowNewCampaignModal(true); }
      if (e.key === 'Escape') { setShowNewCampaignModal(false); setSidebarOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isClientView = currentView === 'Client View';

  const handleNav = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${isClientView ? 'bg-slate-50' : 'bg-[#0f1117]'}`}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-64 bg-[#14161f] border-r border-gray-800 flex-col z-20 flex-shrink-0">
        <SidebarContent
          currentView={currentView}
          onNav={handleNav}
          isClientView={isClientView}
        />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-[#14161f] border-r border-gray-800 flex flex-col z-50 lg:hidden shadow-2xl">
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent
              currentView={currentView}
              onNav={handleNav}
              isClientView={isClientView}
            />
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Header */}
        <header className={`h-16 sm:h-20 border-b flex items-center justify-between px-4 sm:px-8 z-10 flex-shrink-0 ${isClientView ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#14161f] border-gray-800'}`}>
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <h2 className={`text-base sm:text-xl font-semibold ${isClientView ? 'text-gray-900' : 'text-white'}`}>
                {currentView}
              </h2>
              {isClientView && (
                <span className="hidden sm:inline px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                  Client View Mode
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search – hidden on very small mobile */}
            <div className="relative hidden sm:block">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isClientView ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-44 sm:w-64 ${
                  isClientView
                    ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
                    : 'bg-[#0f1117] border-gray-800 text-white focus:bg-[#1a1d27]'
                }`}
              />
            </div>

            {!isClientView && (
              <button
                onClick={() => setShowNewCampaignModal(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Campaign</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            {isClientView && (
              <button
                onClick={() => setCurrentView('Campaigns')}
                className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 underline"
              >
                Exit
              </button>
            )}
          </div>
        </header>

        {/* Mobile search bar */}
        <div className={`sm:hidden px-4 py-2 border-b ${isClientView ? 'bg-white border-gray-200' : 'bg-[#14161f] border-gray-800'}`}>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isClientView
                  ? 'bg-gray-50 border-gray-200 text-gray-900'
                  : 'bg-[#0f1117] border-gray-800 text-white'
              }`}
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="animate-in fade-in duration-300 w-full h-full">
            {currentView === 'Campaigns'    && <CampaignsView searchQuery={searchQuery} />}
            {currentView === 'Team Workload' && <TeamWorkloadView />}
            {currentView === 'Client View'  && <ClientDashboardView searchQuery={searchQuery} />}
            {currentView === 'Tasks' && (
              <div className="text-center py-20 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <p className="text-lg font-medium">Task Board</p>
                <p className="text-sm mt-1">Coming soon — click on a campaign card to view its tasks.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Bottom Navigation ── */}
        <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t ${isClientView ? 'bg-white border-gray-200' : 'bg-[#14161f] border-gray-800'} flex`}>
          {NAV_ITEMS.map(({ label, icon: Icon, view }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] font-medium transition-colors ${
                currentView === view
                  ? 'text-indigo-500'
                  : isClientView ? 'text-gray-400 hover:text-gray-700' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label === 'Team Workload' ? 'Team' : label}
            </button>
          ))}
        </nav>
      </main>

      {showNewCampaignModal && (
        <NewCampaignModal onClose={() => setShowNewCampaignModal(false)} />
      )}
    </div>
  );
}

function SidebarContent({ currentView, onNav, isClientView }) {
  return (
    <>
      <div className="p-6 flex flex-col items-center border-b border-gray-800/50">
        <svg viewBox="0 0 100 100" className="w-14 h-14 mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <p className="text-[8px] text-gray-500 tracking-widest uppercase mt-1">Streamline. Manage. Deliver.</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, view }) => (
          <button
            key={view}
            onClick={() => onNav(view)}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              currentView === view
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </>
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
