import React, { useState } from 'react';
import { usePersistence } from '../hooks/usePersistence';
import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';

const STATUS_CONFIG = {
  'Planning':    { bg: 'bg-sky-100',    text: 'text-sky-700',    dot: 'bg-sky-400' },
  'In Progress': { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-400' },
  'Review':      { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  'Delivered':   { bg: 'bg-emerald-100',text: 'text-emerald-700',dot: 'bg-emerald-400' },
};

const TASK_STATUS_ICONS = {
  'Done':        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
  'In Progress': <Clock className="w-4 h-4 text-violet-500 flex-shrink-0" />,
  'Review':      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  'Todo':        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />,
};

const CircularProgress = ({ progress }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 80 ? '#10b981' :
    pct >= 50 ? '#6366f1' :
    pct >= 25 ? '#f59e0b' : '#94a3b8';

  return (
    <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
      <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} stroke="#e2e8f0" strokeWidth="5" fill="transparent" />
        <circle
          cx="36" cy="36" r={radius}
          stroke={color} strokeWidth="5" fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-gray-800">{pct}%</span>
    </div>
  );
};

export default function ClientDashboardView({ searchQuery }) {
  const { campaigns, tasks } = usePersistence();
  const [selectedClient, setSelectedClient] = useState('All');

  const clients = ['All', ...new Set(campaigns.map(c => c.clientName))];

  const filteredCampaigns = campaigns.filter(c => {
    const matchesClient = selectedClient === 'All' || c.clientName === selectedClient;
    const matchesSearch = !searchQuery ||
      c.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesSearch;
  });

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-indigo-50/30 text-gray-900 rounded-xl">
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Client Portal</h2>
            <p className="text-gray-500 text-sm mt-1">Real-time status of your campaigns</p>
          </div>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full sm:w-auto bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {clients.map(c => <option key={c} value={c}>{c === 'All' ? 'All Clients' : c}</option>)}
          </select>
        </div>

        {/* Campaign Cards */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500">No campaigns found for the selected client.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredCampaigns.map(campaign => {
              const campaignTasks = tasks.filter(t => t.campaignId === campaign.id);
              const progress = Math.max(0, Math.min(100, Number(campaign.progress) || 0));

              // Timeline: start 60 days before deadline
              const deadlineDate = new Date(campaign.deadline);
              const startDate = new Date(deadlineDate);
              startDate.setDate(startDate.getDate() - 60);
              const today = new Date();
              const totalDuration = deadlineDate - startDate;
              const elapsed = today - startDate;
              const timeProgress = Math.max(0, Math.min(100, Math.round((elapsed / totalDuration) * 100)));

              const cfg = STATUS_CONFIG[campaign.status] || STATUS_CONFIG['Planning'];

              return (
                <div key={campaign.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 border-b border-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">{campaign.clientName}</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{campaign.campaignName}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{campaign.type} Campaign</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                          {campaign.status}
                        </span>
                        <p className="text-xs text-gray-400">Due: {deadlineDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="p-5 sm:p-6 border-b border-gray-50">
                    <div className="flex items-center gap-5">
                      <CircularProgress progress={progress} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Campaign Timeline</p>
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>Start: {startDate.toLocaleDateString()}</span>
                          <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
                        </div>
                        {/* Timeline bar — shows time elapsed */}
                        <div className="w-full bg-gray-100 rounded-full h-2.5 relative overflow-visible">
                          <div
                            className="h-2.5 rounded-full transition-all duration-1000"
                            style={{
                              width: `${timeProgress}%`,
                              background: 'linear-gradient(90deg, #818cf8, #6366f1)'
                            }}
                          />
                          {/* Today marker */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-700 border-2 border-white shadow-md z-10"
                            style={{ left: `calc(${timeProgress}% - 6px)` }}
                            title={`Today — ${timeProgress}% of timeline elapsed`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>{timeProgress}% time elapsed</span>
                          <span>Today</span>
                        </div>

                        {/* Task done stats */}
                        {campaignTasks.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-emerald-400 transition-all duration-700"
                                style={{ width: `${Math.round((campaignTasks.filter(t => t.status === 'Done').length / campaignTasks.length) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {campaignTasks.filter(t => t.status === 'Done').length}/{campaignTasks.length} tasks done
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  {campaignTasks.length > 0 && (
                    <div className="p-5 sm:p-6">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Deliverables</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {campaignTasks.map(task => (
                          <div key={task.id} className={`flex items-center gap-2.5 p-3 rounded-xl border ${task.status === 'Done' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                            {TASK_STATUS_ICONS[task.status] || TASK_STATUS_ICONS['Todo']}
                            <span className={`text-sm flex-1 min-w-0 truncate ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                              {task.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              task.status === 'Done' ? 'bg-emerald-100 text-emerald-600' :
                              task.status === 'In Progress' ? 'bg-violet-100 text-violet-600' :
                              task.status === 'Review' ? 'bg-amber-100 text-amber-600' :
                              'bg-gray-200 text-gray-500'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="px-5 sm:px-6 pb-4 text-right text-xs text-gray-300">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
